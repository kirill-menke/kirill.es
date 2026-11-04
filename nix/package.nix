# kirill.es as a Nix package: `vite build` (adapter-node + prerender) plus the
# production node_modules the bundle still imports at runtime.
#
# Layout of $out:
#
#   bin/kirill-es                 node wrapper around lib/kirill-es/build/index.js
#   lib/kirill-es/build/          adapter-node output (index.js, handler.js, client/, server/, prerendered/)
#   lib/kirill-es/node_modules/   runtime deps only
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

  installPhase = ''
    runHook preInstall

    # Drop devDependencies (vite, svelte, eslint, ...); the adapter-node bundle
    # keeps package.json "dependencies" external, so those must stay.
    npm prune --omit=dev --no-save --offline

    mkdir -p $out/lib/kirill-es $out/bin
    cp -r build node_modules package.json $out/lib/kirill-es/

    makeWrapper ${lib.getExe nodejs} $out/bin/kirill-es \
      --add-flags $out/lib/kirill-es/build/index.js

    runHook postInstall
  '';

  # Fail the build, not the deploy, if the server bundle or the prerendered
  # home page is missing.
  doInstallCheck = true;
  installCheckPhase = ''
    runHook preInstallCheck
    test -f $out/lib/kirill-es/build/index.js
    test -f $out/lib/kirill-es/build/prerendered/index.html
    runHook postInstallCheck
  '';

  meta = {
    description = "kirill.es personal website (SvelteKit, adapter-node)";
    mainProgram = "kirill-es";
    platforms = lib.platforms.linux;
  };
}
