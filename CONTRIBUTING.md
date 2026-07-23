# Contributing

WarLink is currently developed as a private-group MVP in a public repository.
Before opening a change, read the product requirements, architecture boundaries,
and delivery slicing guide.

## Workflow

1. Create an issue or PRD slice with one independently verifiable outcome.
2. Create a short-lived branch from `main`.
3. Add or update tests with the implementation.
4. Run the full local validation suite.
5. Open a pull request using the repository template.

Keep privileged agent changes narrow. Any change involving command execution,
firewall rules, service installation, credentials, or control-plane
authorization requires explicit security acceptance criteria.

## Commands

```bash
pnpm install
pnpm check
pnpm build
go test ./apps/agent/... ./apps/desktop/...
```

Go code must pass `gofmt`; TypeScript, JSON, YAML, and Markdown must pass
Prettier. Do not commit generated Wails bindings, build output, `.dev.vars`, or
real infrastructure identifiers.

## Commit style

Use short, imperative commit subjects. Conventional Commit prefixes are
encouraged, for example `feat(agent): read ZeroTier node identity`.
