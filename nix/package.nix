# kirill.es as a Nix package: `vite build` (adapter-node + prerender) plus the
# production node_modules the bundle still imports at runtime.
#
# Layout of $out:
#
#   bin/kirill-es                 node wrapper around lib/kirill-es/build/index.js
#   lib/kirill-es/build/          adapter-node output (index.js, handler.js, client/, server/, prerendered/)
#   lib/kirill-es/node_modules/   runtime deps only (better-sqlite3, sharp, @google/genai, ...)
#   lib/kirill-es/package.json    adapter-node's ESM entry needs "type": "module" next to build/
#
# Deps come from package-lock.json via importNpmLock, the same as kirifin's
# frontend: no npmDepsHash to bump when the lockfile changes.
{
  lib,
  path,
  callPackage,
  buildNpmPackage,
  importNpmLock,
  nodejs_22,
  python3,
  makeWrapper,
  version ? "0-unstable",
}:
let
  # An allowlist, not a denylist: nothing outside these paths can end up in the
  # world-readable /nix/store. That matters here because the working tree holds
  # .env / .env.prod / .env.dev with live API keys, plus landscape.db, logs/ and
  # debug/. (A git flake already drops untracked files, but `nix build path:.`
  # or a dirty tree would not.)
  src = lib.fileset.toSource {
    root = ../.;
    fileset = lib.fileset.unions [
      ../package.json
      ../package-lock.json
      ../svelte.config.js
      ../vite.config.js
      ../src
      ../static
    ];
  };

  # Node 22, as in CI and on Hetzner. Two things pin it there for now:
  #
  #  * importNpmLock.npmConfigHook compiles native addons against the headers
  #    of nixpkgs' *default* nodejs (24 here), whatever `nodejs` is passed to
  #    buildNpmPackage. Mixing them gives ERR_DLOPEN_FAILED (undefined symbol
  #    v8::String::Utf8Value) at prerender time. So the hook is instantiated
  #    against the same Node explicitly below.
  #  * On Node 24, better-sqlite3 12.4.1 aborts at process exit (Assertion
  #    `(env) != nullptr` in Statement::~Statement) when prepared statements
  #    are still alive, as src/lib/db.js's always are: every stop would end in
  #    a core dump. Revisit after bumping better-sqlite3.
  nodejs = nodejs_22;
  npmHooks = callPackage (path + "/pkgs/build-support/node/import-npm-lock/hooks") {
    inherit nodejs;
  };
in
buildNpmPackage {
  pname = "kirill-es";
  inherit version src;

  inherit nodejs;

  npmDeps = importNpmLock { npmRoot = src; };
  inherit (npmHooks) npmConfigHook;

  # better-sqlite3's install script is `prebuild-install || node-gyp rebuild`.
  # prebuild-install needs the network and fails in the sandbox, so node-gyp
  # compiles it against the Node headers (the hook sets npm_config_nodedir);
  # node-gyp needs python3. sharp 0.34 needs nothing here: its prebuilt
  # @img/sharp-linux-x64 + @img/sharp-libvips-linux-x64 are ordinary lockfile
  # entries, fetched like any other package.
  nativeBuildInputs = [
    python3
    makeWrapper
  ];

  # Not npm_config_build_from_source: it is global, and it makes sharp try (and
  # fail) a node-gyp build of its own instead of using the prebuilt package.
  env = {
    # "prepare": "husky" must not try to install git hooks in the sandbox.
    HUSKY = "0";
  };

  # `npm run build` = `vite build`. It also prerenders every page except
  # /landscape. The server modules get imported during analysis, so
  # src/lib/db.js opens (and creates) ./landscape.db inside the build tree.
  # That file is never installed: installPhase copies build/ only.
  npmBuildScript = "build";

  installPhase = ''
    runHook preInstall

    # Drop devDependencies (vite, svelte, eslint, ...); the adapter-node bundle
    # keeps package.json "dependencies" external, so those must stay.
    npm prune --omit=dev --no-save --offline

    # node-gyp leftovers: sources, objects, Makefiles. config.gypi and the .mk
    # files also pin the Node source tree into the runtime closure. Only the
    # addon itself is loaded (via `bindings`, from build/Release).
    rm -rf node_modules/better-sqlite3/{deps,src}
    find node_modules/better-sqlite3/build -mindepth 1 -maxdepth 1 ! -name Release -exec rm -rf {} +
    find node_modules/better-sqlite3/build/Release -mindepth 1 ! -name better_sqlite3.node -exec rm -rf {} +

    mkdir -p $out/lib/kirill-es $out/bin
    cp -r build node_modules package.json $out/lib/kirill-es/

    makeWrapper ${lib.getExe nodejs} $out/bin/kirill-es \
      --add-flags $out/lib/kirill-es/build/index.js

    runHook postInstall
  '';

  # Fail the build, not the deploy, if a native module does not load.
  doInstallCheck = true;
  installCheckPhase = ''
    runHook preInstallCheck
    cd $out/lib/kirill-es
    ${lib.getExe nodejs} -e '
      const Database = require("better-sqlite3");
      new Database(":memory:").prepare("select 1").get();
      require("sharp");
      console.log("native modules OK");
    '
    test -d build/client/landscape-references
    cd - >/dev/null
    runHook postInstallCheck
  '';

  passthru = {
    # The app resolves `static/landscape-references` against its cwd, and
    # vite copies static/ into the client bundle, so this is the directory the
    # NixOS module links in as <cwd>/static.
    staticDir = "lib/kirill-es/build/client";
  };

  meta = {
    description = "kirill.es personal website (SvelteKit, adapter-node)";
    mainProgram = "kirill-es";
    platforms = lib.platforms.linux;
  };
}
