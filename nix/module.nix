# NixOS module for kirill.es, exported as nixosModules.default. Import it and set services.kirill-es.enable.
#
# Knows nothing about microvms or Cloudflare. It runs the adapter-node server
# as a hardened systemd service. Whatever proxies to it (cloudflared in the
# NAS guest) is the consumer's business.
#
# The app needs no secrets, opens no outbound connections and keeps no state:
# it only serves prerendered pages and static assets.
self:
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.kirill-es;
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

    # Kept so configs that still set it evaluate; drop it once nothing does.
    origin = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      example = "https://kirill.es";
      description = "Ignored. adapter-node 6 no longer reads ORIGIN; the server derives the origin from each request's Host header.";
    };

    extraEnvironment = lib.mkOption {
      type = lib.types.attrsOf lib.types.str;
      default = { };
      example = {
        SHUTDOWN_TIMEOUT = "10";
      };
      description = "Extra non-secret environment variables (e.g. adapter-node's SHUTDOWN_TIMEOUT).";
    };
  };

  config = lib.mkIf cfg.enable {
    warnings = lib.optional (cfg.origin != null) (
      "services.kirill-es.origin is ignored: adapter-node 6 no longer reads ORIGIN. Remove it."
    );

    systemd.services.kirill-es = {
      description = "kirill.es website (SvelteKit / adapter-node)";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];

      environment = {
        NODE_ENV = "production";
        HOST = cfg.host;
        PORT = toString cfg.port;
      }
      // cfg.extraEnvironment;

      serviceConfig = {
        ExecStart = lib.getExe cfg.package;

        DynamicUser = true;
        UMask = "0077";

        Restart = "on-failure";
        RestartSec = 5;
        # adapter-node drains in-flight requests on SIGTERM.
        TimeoutStopSec = 30;

        # Writes nothing but its private /tmp.
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

        # The server only answers requests (cloudflared connects in over
        # loopback); it never opens a connection of its own. So no network
        # beyond loopback at all, a second fence behind the host's nftables.
        IPAddressDeny = "any";
        IPAddressAllow = "localhost";

        MemoryHigh = "200M";
        MemoryMax = "300M";
      };
    };
  };
}
