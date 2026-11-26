# spell-checker: words gnumake nasm posix stdenv valgrind
{
  description = ''
    Flows/Pipelines with "Inngest" (Go/Python/TypeScript)
  '';

  inputs = {
    devenv = {
      url = "github:cachix/devenv";
    };

    latest = {
      url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
    };
  };

  outputs = {self, ...} @ inputs: let
    forSystems = inputs.latest.lib.genAttrs [
      "x86_64-linux"
    ];

    mkPackages = system: pkgs: overlays:
      import pkgs {
        inherit system overlays;
      };
  in {
    devShells = forSystems (system: let
      pkgs = mkPackages system inputs.devenv.inputs.nixpkgs (with self.overlays; [
        pkgs_pass_through
      ]);
    in {
      default = inputs.devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          ({
            pkgs,
            lib,
            ...
          }: let
            inherit (lib.meta) getExe;
          in {
            languages = {
              javascript = {
                enable = true;

                pnpm = {
                  enable = true;
                };
              };

              nix = {
                enable = true;
              };

              typescript = {
                enable = true;
              };
            };

            git-hooks = {
              # Automatische Formatierung & Linting (Checks)
              hooks = {
                alejandra.enable = true;

                biome.enable = true;
              };
            };

            env = {
              PUPPETEER_SKIP_DOWNLOAD = "true";
              CHROME_PATH = getExe pkgs.from.latest.chromium;
            };

            packages = builtins.concatLists [
              (with pkgs.from.latest; [
                # Entwicklungswerkzeuge
                alejandra
              ])
              (with pkgs; [
                # Entwicklungswerkzeuge
                biome
              ])
            ];
          })
        ];
      };
    });

    formatter = forSystems (
      system: let
        pkgs = mkPackages system inputs.latest [];
      in
        pkgs.alejandra
    );

    overlays = {
      pkgs_pass_through = final: super: {
        from = {
          latest = mkPackages super.stdenv.hostPlatform.system inputs.latest [];
        };
      };
    };
  };
}
