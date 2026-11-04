# kirill.es as a Nix package: `vite build` (adapter-node + prerender). The
# server bundle inlines every import except node: builtins, so no node_modules
# ship with it. That holds only while package.json has no "dependencies":
# adapter-node may leave those external, and the install check below would fail.
#
# Layout of $out:
#
#   bin/kirill-es                 node wrapper around lib/kirill-es/build/index.js
#   lib/kirill-es/build/          adapter-node output (index.js, handler.js, client/, server/, prerendered/)
#   lib/kirill-es/package.json    adapter-node's ESM entry needs "type": "module" next to build/
#
# Deps come from package-lock.json via importNpmLock, the same as kirifin's
# frontend: no npmDepsHash to bump when the lockfile changes.
{
  lib,
  buildNpmPackage,
  importNpmLock,
  nodejs_26,
  makeWrapper,
  version ? "0-unstable",
}:
let
  # An allowlist, not a denylist: nothing outside these paths can end up in the
  # world-readable /nix/store, whatever else lies in the working tree (.env
  # files). A git flake already drops untracked files, but
  # `nix build path:.` or a dirty tree would not.
  src = lib.fileset.toSource {
    root = ../.;
    fileset = lib.fileset.unions [
      ../package.json
      ../package-lock.json
      ../vite.config.js
      ../src
      ../static
    ];
  };

  # Node 26: the current LTS line (active until 2027-10, supported until 2029-04).
  nodejs = nodejs_26;
in
buildNpmPackage {
  pname = "kirill-es";
  inherit version src nodejs;

  npmDeps = importNpmLock { npmRoot = src; };
  npmConfigHook = importNpmLock.npmConfigHook;

  nativeBuildInputs = [ makeWrapper ];

  # `npm run build` = `vite build`, which also prerenders every page.
  npmBuildScript = "build";

  # Kit's version.name (vite.config.js) defaults to Date.now(), which would
  # make every build differ.
  env.KIRILL_ES_VERSION = version;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/lib/kirill-es $out/bin
    cp -r build package.json $out/lib/kirill-es/

    makeWrapper ${lib.getExe nodejs} $out/bin/kirill-es \
      --add-flags $out/lib/kirill-es/build/index.js

    runHook postInstall
  '';

  # Fail the build, not the deploy, if the server bundle or the prerendered
  # home page is missing, or if the bundle cannot load without node_modules.
  # handler.js initialises the server without listening; the route entries
  # are imported too because the server only loads them on a request.
  doInstallCheck = true;
  installCheckPhase = ''
    runHook preInstallCheck
    test -f $out/lib/kirill-es/build/index.js
    test -f $out/lib/kirill-es/build/prerendered/index.html
    ${lib.getExe nodejs} --input-type=module \
      -e 'for (const file of process.argv.slice(1)) await import(file)' \
      $out/lib/kirill-es/build/handler.js $(find $out/lib/kirill-es/build/server/entries -name '*.js')
    runHook postInstallCheck
  '';

  meta = {
    description = "kirill.es personal website (SvelteKit, adapter-node)";
    mainProgram = "kirill-es";
    platforms = lib.platforms.linux;
  };
}
