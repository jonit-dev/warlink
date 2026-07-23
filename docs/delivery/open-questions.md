# Open product questions

Resolve these before slicing the affected behavior.

## Room-code alphabet

The PRD requires eight Crockford Base32 characters and exclusion of visually
confusing characters, but its recurring example `WOLF-7K2M` contains `O` and
`L`. Strict Crockford Base32 excludes both letters.

The scaffold protocol validator currently follows strict Crockford Base32.
Before implementing room creation or final UI copy, decide whether to:

1. Keep strict Crockford Base32 and replace the examples.
2. Define a project-specific alphabet that permits recognizable words.

The choice affects code generation, validation, entropy calculations, rate-limit
assumptions, documentation, and test fixtures.
