# WarLink

WarLink is a cross-platform desktop launcher for playing Warcraft III LAN
multiplayer over the internet. It coordinates temporary room access through a
Cloudflare control plane and carries game traffic peer-to-peer over ZeroTier.

The project is at the pre-MVP scaffolding stage. The product requirements are
the source of truth; the current code establishes boundaries and build tooling
without claiming to implement the user flows yet.

## Start here

- [Product requirements](docs/project-requirements.md)
- [Architecture](docs/architecture.md)
- [Delivery roadmap](docs/delivery/roadmap.md)
- [How to slice work](docs/delivery/slicing-guide.md)
- [Open product questions](docs/delivery/open-questions.md)
- [Contributing](CONTRIBUTING.md)

The first product milestone is the Phase 0 mixed-OS networking proof of concept.
It must prove Warcraft III `1.32.10.18820` lobby discovery between Windows and
Linux over ZeroTier before the polished desktop experience is built.

## Repository layout

```text
apps/desktop/        Wails desktop UI and unprivileged Go backend
apps/agent/          Privileged Go service and OS integrations
cloudflare/          Workers API and Room Durable Object
packages/protocol/   Shared control-plane contracts
packages/release-manifest/ Signed update manifest contracts
installers/          Windows and Debian packaging work
tests/               Integration, E2E, and network-lab assets
docs/                Requirements, decisions, and operating documentation
```

## Prerequisites

- Node.js 22 or newer
- pnpm 10.25.0 (the repository-pinned package manager)
- Go 1.26.3
- Wails v2 prerequisites for your operating system when working on the desktop
- A Cloudflare account only when deploying the control plane

Enable the pinned pnpm version with Corepack if needed:

```bash
corepack enable
corepack install
```

## Local validation

```bash
pnpm install
pnpm check
pnpm build
go test ./apps/agent/... ./apps/desktop/...
```

Run the web frontend with `pnpm --filter @warlink/desktop-frontend dev`. Once
Wails is installed, run the native desktop shell from `apps/desktop` with
`wails dev`.

Run the control plane locally with:

```bash
pnpm --filter @warlink/control-plane dev
```

Create `cloudflare/.dev.vars` for local secrets. Never commit secrets, room
tokens, host private keys, ZeroTier credentials, or diagnostic bundles.

## Licensing

No open-source license has been selected yet. Copyright is retained by the
project owner. A licensing decision is required before accepting external code
contributions or publishing distributable releases.
