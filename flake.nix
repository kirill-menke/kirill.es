{
  # Exposes what the NAS needs and nothing about the NAS itself:
  #   packages.x86_64-linux.default   the built site (nix/package.nix)
  #   nixosModules.default            services.kirill-es, a hardened systemd unit (nix/module.nix)
  #   checks.x86_64-linux.package     so `nix flake check` (CI) builds it
  #
  # Same shape as vibe-reel/backend and kirifin: the NixOS module builds the
  # package with the *consumer's* nixpkgs, so importing it does not drag a
  # second nixpkgs into the NAS closure.
  description = "kirill.es personal website";

  # Overridden by `inputs.kirill-es.inputs.nixpkgs.follows = "nixpkgs"` in the NAS flake.
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      version = self.shortRev or self.dirtyShortRev or "dirty";
    in
    {
      packages.${system}.default = pkgs.callPackage ./nix/package.nix { inherit version; };

      nixosModules.default = import ./nix/module.nix self;

      checks.${system}.package = self.packages.${system}.default;

      # `nix run` = production server on :3000 with a throwaway DB in ./,
      # handy for checking a Nix-built bundle before deploying.
      apps.${system}.default = {
        type = "app";
        program = nixpkgs.lib.getExe self.packages.${system}.default;
      };

      formatter.${system} = pkgs.nixfmt-tree;
    };
}
