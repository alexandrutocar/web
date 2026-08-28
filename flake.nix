{
  description = "ueuie.earth";

  inputs = {
    nixpkgs-unstable.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";

    devenv = {
      url = "github:cachix/devenv";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };
  };

  outputs = {self, ...} @ inputs: let
    forSystems = inputs.nixpkgs-unstable.lib.genAttrs [
      "x86_64-linux"
    ];

    mkPackages = system: pkgs:
      import pkgs {
        inherit system;
      };
  in {
    devShells = forSystems (system: let
      pkgs = mkPackages system inputs.nixpkgs-unstable;
    in {
      default = inputs.devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          (_: {
            languages = {
              deno = {
                enable = true;
              };

              nix = {
                enable = true;
              };

              typescript = {
                enable = true;
              };
            };

            git-hooks.hooks = {
              alejandra.enable = true;

              denofmt.enable = true;

              denolint.enable = true;
            };

            packages = with pkgs; [
              alejandra
            ];
          })
        ];
      };
    });

    formatter = forSystems (
      system: let
        pkgs = mkPackages system inputs.nixpkgs-unstable;
      in
        pkgs.alejandra
    );
  };
}
