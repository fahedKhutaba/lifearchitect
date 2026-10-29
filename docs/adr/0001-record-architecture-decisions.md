# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Lead

## Context

The product is built by multiple AI agents that do not share conversation history. Decisions made in one session are invisible to the next unless they are written down.

## Decision

Every architectural decision is recorded as an ADR in `docs/adr/`, numbered sequentially, using `0000-template.md`. Agents read ADRs as binding instructions.

## Consequences

- Decisions survive across sessions and agents.
- A changed decision gets a new ADR that supersedes the old one; old ADRs are never edited.
- ADRs double as public documentation of how the project evolved.
