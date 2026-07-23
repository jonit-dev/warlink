# Architecture

WarLink has three trust zones:

1. The unprivileged Wails desktop application owns presentation, local
   configuration, and control-plane sessions.
2. The privileged Go agent owns ZeroTier, firewall, service, diagnostics, and
   Warcraft launch operations behind authenticated local IPC.
3. The Cloudflare control plane owns short-lived rooms, host authorization,
   rate limits, presence, and ZeroTier Central authorization.

Cloudflare carries control messages only. Warcraft traffic travels between
ZeroTier peers and must never be proxied through the Worker.

## Dependency direction

```text
desktop frontend -> Wails backend -> authenticated local IPC -> agent
       |                    |
       +------ HTTPS / secure WebSocket ------> control plane

control plane -> ZeroTier Central API
agent         -> local ZeroTier service
```

The agent must not trust executable paths or shell commands from the desktop or
control plane. It launches only a locally configured Warcraft target.

Shared TypeScript packages define wire-level data, not control-plane or UI
business logic. The Go side will gain generated or explicitly mirrored
contracts only when an implementing slice needs them.

## Decisions

Architecture decisions live in `docs/decisions`. Material changes to trust
boundaries, networking, persistence, protocols, or supported platforms require
an ADR.

- [ADR 0001: System foundation](decisions/0001-system-foundation.md)

The complete requirements and quality constraints remain in
`project-requirements.md`.
