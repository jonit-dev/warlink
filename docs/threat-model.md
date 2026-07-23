# Threat model

This document is a starting inventory, not a completed security review.

## Assets

- ZeroTier Central API token and network membership authority.
- Host signing private keys and enrollment capability.
- Short-lived room session tokens and room membership.
- Privileged local agent authority.
- Local firewall state and configured Warcraft launch target.
- Privacy-safe diagnostic data.

## Trust boundaries

- Internet client to Cloudflare Worker.
- Worker to Room Durable Object.
- Worker to ZeroTier Central.
- Unprivileged desktop process to privileged local agent.
- Agent to ZeroTier service and operating-system facilities.
- Build and release pipeline to installed client.

## Required invariants

- Administrative tokens never reach clients or logs.
- Room codes are capability-like but rate-limited, short-lived, and not
  administrative credentials.
- The agent authenticates local callers and rejects arbitrary executable or
  shell-command input.
- Firewall access is temporary and limited to the ZeroTier interface.
- Joining, leaving, and cleanup are idempotent.
- Downloaded installers and releases are pinned and cryptographically verified.
- Room state and temporary membership expire even when clients disappear.

Each implementing slice must expand the relevant threats and provide testable
mitigations.
