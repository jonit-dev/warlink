# ADR 0001: System foundation

- Status: Accepted
- Date: 2026-07-22

## Context

WarLink must provide nontechnical Windows and Linux users with temporary access
to a Warcraft III LAN session without exposing administrative credentials or
operating a game relay.

## Decision

Use:

- Go and Wails v2 for the desktop application.
- A separate privileged Go agent installed as a Windows Service or systemd unit.
- TypeScript on Cloudflare Workers with one Durable Object per room.
- One reusable private ZeroTier network with temporary member authorization.
- pnpm workspaces for all JavaScript and TypeScript projects.

Cloudflare carries control-plane traffic only. ZeroTier carries game traffic.

## Consequences

Privileged OS behavior remains isolated from the UI, local IPC becomes a
security boundary, and room state has one strongly consistent owner. Packaging
and testing must cover two operating systems and separate privilege levels.

The architecture depends on Phase 0 proving that Warcraft III LAN discovery
works over the selected ZeroTier configuration.

## Validation

The decision remains valid if a Windows host and Linux player running Warcraft
III `1.32.10.18820` can discover, join, and complete a LAN match over ZeroTier
without router changes or relayed game traffic.
