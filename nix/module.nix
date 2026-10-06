# NixOS module for kirill.es, exported as nixosModules.default. Import it and set services.kirill-es.enable.
#
# Knows nothing about microvms or Cloudflare. It runs the adapter-node server
# as a hardened systemd service. Whatever proxies to it (cloudflared in the
# NAS guest) is the consumer's business.
#
# What the app expects at runtime and how this maps it:
#
#   <cwd>/logs/access.log              -> StateDirectory kirill-es/logs (cwd = state dir)
#   <cwd>/debug/ (DEBUG_PIPELINE)      -> created by the app inside the state dir
#   <cwd>/static/landscape-references  -> symlink to the package's build/client
#   DATABASE_PATH                      -> <state dir>/landscape.db
#   os.tmpdir() (Stability SDK files)  -> PrivateTmp
#   secrets via process.env            -> EnvironmentFile (read by PID 1, root-only file)
self:
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.kirill-es;
  stateDir = "/var/lib/kirill-es";
in
{
  options.services.kirill-es = {
    enable = lib.mkEnableOption "the kirill.es website";

    package = lib.mkOption {
      type = lib.types.package;
      # Built with the consumer's nixpkgs, as reel-api and kirifin do.
      default = pkgs.callPackage (self + "/nix/package.nix") {
        version = self.shortRev or self.dirtyShortRev or "dirty";
      };
      defaultText = lib.literalExpression "kirill-es built from this flake with the system's pkgs";
      description = "The kirill.es package to run.";
    };

    host = lib.mkOption {
      type = lib.types.str;
      default = "127.0.0.1";
      description = "Listen address (adapter-node HOST). Loopback when a local proxy (cloudflared) fronts it.";
    };

    port = lib.mkOption {
      type = lib.types.port;
      default = 3000;
      description = "Listen port (adapter-node PORT).";
    };

    origin = lib.mkOption {
      type = lib.types.str;
      example = "https://kirill.es";
      description = "Public origin (adapter-node ORIGIN). SvelteKit's CSRF check compares POST Origin headers against it.";
    };

    addressHeader = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      example = "CF-Connecting-IP";
      description = ''
        Header with the real client IP (adapter-node ADDRESS_HEADER), used by
        the access log and the /api/generate-image rate limit. Only set this
        when every request passes through a proxy that overwrites the header.
        Otherwise clients can spoof it.
      '';
    };

    debugPipeline = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "DEBUG_PIPELINE: write tile-pipeline debug images to <state dir>/debug.";
    };

    environmentFile = lib.mkOption {
      type = lib.types.nullOr lib.types.path;
      default = null;
      example = "/run/host-secrets/app.env";
      description = ''
        dotenv-style file with the secrets: ADMIN_PASSWORD (required in
        production, else /landscape and /api/* answer 503), GEMINI_API_KEY,
        optional STABILITY_API_KEY. Pass it as a string path. A Nix path
        literal would copy the secrets into the world-readable store.
      '';
    };

    extraEnvironment = lib.mkOption {
      type = lib.types.attrsOf lib.types.str;
      default = { };
      example = {
        BODY_SIZE_LIMIT = "2M";
      };
      description = "Extra non-secret environment variables (e.g. adapter-node's BODY_SIZE_LIMIT).";
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services.kirill-es = {
      description = "kirill.es website (SvelteKit / adapter-node)";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];

      environment = {
        NODE_ENV = "production";
        HOST = cfg.host;
        PORT = toString cfg.port;
        ORIGIN = cfg.origin;
        DATABASE_PATH = "${stateDir}/landscape.db";
        DEBUG_PIPELINE = lib.boolToString cfg.debugPipeline;
      }
      // lib.optionalAttrs (cfg.addressHeader != null) { ADDRESS_HEADER = cfg.addressHeader; }
      // cfg.extraEnvironment;

      serviceConfig = {
        ExecStartPre = "${pkgs.coreutils}/bin/ln -sfn ${cfg.package}/${cfg.package.staticDir} ${stateDir}/static";
        ExecStart = lib.getExe cfg.package;
        WorkingDirectory = stateDir;
        EnvironmentFile = lib.mkIf (cfg.environmentFile != null) cfg.environmentFile;

        DynamicUser = true;
        # /var/lib/private/kirill-es (+ the /var/lib/kirill-es symlink): DB, logs/, debug/.
        StateDirectory = [
          "kirill-es"
          "kirill-es/logs"
        ];
        StateDirectoryMode = "0700";
        UMask = "0077";

        Restart = "on-failure";
        RestartSec = 5;
        # adapter-node drains in-flight requests on SIGTERM. A tile generation
        # (Gemini + Stability round trips) can take a while.
        TimeoutStopSec = 60;

        # Writes nothing but its StateDirectory and private /tmp.
        ProtectSystem = "strict";
        ProtectHome = true;
        PrivateTmp = true;
        PrivateDevices = true;
        PrivateUsers = true;
        ProtectHostname = true;
        ProtectClock = true;
        ProtectKernelTunables = true;
        ProtectKernelModules = true;
        ProtectKernelLogs = true;
        ProtectControlGroups = true;
        ProtectProc = "invisible";
        ProcSubset = "pid";
        NoNewPrivileges = true;
        CapabilityBoundingSet = "";
        AmbientCapabilities = "";
        RestrictAddressFamilies = [
          "AF_INET"
          "AF_INET6"
          "AF_UNIX"
        ];
        RestrictNamespaces = true;
        RestrictRealtime = true;
        RestrictSUIDSGID = true;
        LockPersonality = true;
        RemoveIPC = true;
        SystemCallArchitectures = "native";
        SystemCallFilter = [
          "@system-service"
          "~@privileged"
          "~@resources"
        ];
        SystemCallErrorNumber = "EPERM";
        # V8's JIT needs writable+executable pages; MemoryDenyWriteExecute=true
        # makes node abort at startup.
        MemoryDenyWriteExecute = false;

        # SSRF damage limit: the app only ever talks to loopback (cloudflared
        # in) and public APIs (Gemini, Stability out). Private and CGNAT ranges
        # are refused at the socket level, a second fence behind the host's
        # nftables rules.
        IPAddressDeny = [
          "10.0.0.0/8"
          "172.16.0.0/12"
          "192.168.0.0/16"
          "100.64.0.0/10"
          "169.254.0.0/16"
          "fc00::/7"
          "fe80::/10"
        ];

        MemoryHigh = "600M";
        MemoryMax = "800M";
      };
    };
  };
}
