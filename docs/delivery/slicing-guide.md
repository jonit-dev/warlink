# PRD slicing guide

A slice should produce one observable outcome that can be reviewed, tested, and
reverted independently. Prefer vertical behavior over component-wide buildouts.

Every slice must include:

- The exact PRD section and delivery phase it advances.
- One user or operator outcome.
- Explicit exclusions for adjacent work.
- Acceptance evidence, including target platforms.
- Failure, retry, and idempotent cleanup behavior where relevant.
- Security notes for privileges, trust boundaries, tokens, identifiers, logs,
  downloads, and executable launch behavior.
- Any prerequisite experiment or architecture decision.

Avoid slices such as “build the agent” or “implement rooms.” A useful slice is
closer to “read and validate the local ZeroTier node identity on Windows and
Linux, returning a stable typed result without modifying service state.”

## Definition of ready

- External assumptions have evidence or a named spike.
- API or IPC contracts identify ownership and compatibility expectations.
- Test equipment and supported platforms are available.
- No unresolved choice can materially change the implementation.

## Definition of done

- Acceptance evidence is attached to the pull request.
- Automated tests cover the stable logic and failure modes.
- Platform-specific behavior has manual or automated evidence.
- Logs are structured and redact sensitive values.
- Cleanup survives retries and restarts where state is modified.
- User-facing errors use plain language.
- Documentation and ADRs reflect changed behavior.
