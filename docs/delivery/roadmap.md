# Delivery roadmap

The product requirements define six delivery phases. Work should be sliced in
this order because later UX and automation depend on networking evidence.

## Phase 0: networking proof of concept

1. Record the exact Windows and Linux test environments.
2. Establish manual ZeroTier connectivity across separate home networks.
3. Document narrowly scoped firewall behavior on each operating system.
4. Verify Warcraft III `1.32.10.18820` lobby discovery and gameplay.
5. Determine whether Warcraft must be restarted after the virtual network joins.
6. Capture direct and relayed ZeroTier behavior.

Exit with a reproducible network-lab report. If unicast works but lobby discovery
does not, write an ADR before implementing a discovery relay.

## Phase 1: local Go prototype

Slice read-only ZeroTier inspection first, then join/leave, managed address
inspection, reachability, firewall operations, configured launch behavior, and
authenticated IPC. Each modifying operation needs idempotent cleanup.

## Phase 2: Cloudflare control plane

Slice contracts and validation before ZeroTier mutations. Then deliver host
enrollment, room creation, joining, presence, readiness, launch events, removal,
closure, expiration, retrying cleanup, and layered rate limits.

## Phase 3: desktop UI

Build setup and readiness around proven backend contracts. Deliver first launch,
home, host, join, ready, diagnostics, settings, reconnect, and plain-language
failure states as separate slices.

## Phase 4: installers

Deliver pinned-download verification before service installation. Slice Windows
and Debian packaging independently, then upgrades, crash recovery, uninstall
cleanup, signing, and release manifests.

## Phase 5: private beta

Run the full acceptance matrix across supported operating systems, NAT behavior,
firewalls, Wine launchers, room lifecycle failures, and unexpected shutdowns.

## First issue

The first slice should be a network-lab test plan and evidence template. It has
no production code dependency and resolves the architecture’s largest risk.
