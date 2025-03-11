{ lib, pkgs, ... }: {

  # see: https://github.com/cloudflare/workerd/issues/1482
  env = { LD_LIBRARY_PATH = with pkgs; lib.makeLibraryPath [ libgcc.lib ]; };
  enterShell = ''
    __patchTarget="/home/at/git/blog/node_modules/.pnpm/@cloudflare+workerd-linux-64@1.20250310.0/node_modules/@cloudflare/workerd-linux-64/bin/workerd"
    if [[ -f "$__patchTarget" ]]; then
      ${pkgs.patchelf}/bin/patchelf --set-interpreter ${pkgs.glibc}/lib/ld-linux-x86-64.so.2 "$__patchTarget"
    fi
  '';

  packages = with pkgs; [
    # nix
    nixd
    nixfmt
  ];

  languages = {
    javascript = {
      enable = true;
      pnpm.enable = true;
    };
    opentofu.enable = true;
    typescript.enable = true;
  };

  pre-commit = {
    hooks = {
      # nix
      deadnix.enable = true;
      nixfmt.enable = true;

      # sh
      shellcheck.enable = true;
      shfmt.enable = false;
    };
  };
}
