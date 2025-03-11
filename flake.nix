{
  description = "my public web projects";

  inputs = {
    devenv = {
      url = "github:cachix/devenv/main";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs = { nixpkgs, self, ... }@inputs:
    let
      systems = [ "aarch64-linux" "x86_64-linux" "i686-linux" ];
      forAllSystems = inputs.nixpkgs.lib.genAttrs systems;
    in {
      # formatter
      formatter =
        forAllSystems (system: inputs.nixpkgs.legacyPackages.${system}.nixfmt);

      packages = forAllSystems (system:
        let pkgs = inputs.nixpkgs.legacyPackages.${system};
        in {
          # devenv
          devenv-up = self.devShells.${system}.default.config.procfileScript;
          devenv-test = self.devShells.${system}.default.config.test;

          # waylock-service
          default = pkgs.callPackage ./nix/waylock-service.nix pkgs;
        });

      devShells = forAllSystems (system:
        let pkgs = inputs.nixpkgs.legacyPackages.${system};
        in {
          default = inputs.devenv.lib.mkShell {
            inherit inputs pkgs;

            modules = [ ./devenv.nix ];
          };
        });
    };
}
