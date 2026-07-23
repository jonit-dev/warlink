# Troubleshooting

No production build exists yet. During development, keep failures within their
trust zone:

- Desktop UI and Wails binding failures belong to `apps/desktop`.
- Privileged service, ZeroTier, firewall, launch, and IPC failures belong to
  `apps/agent`.
- Room, authentication, rate-limit, and ZeroTier Central failures belong to
  `cloudflare`.

Do not paste `.dev.vars`, authorization headers, room tokens, host keys, full
node IDs, local Warcraft paths, or raw diagnostic archives into issues.

Known user-facing troubleshooting procedures will be added alongside the slices
that implement them.
