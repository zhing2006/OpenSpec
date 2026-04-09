## MODIFIED Requirements

### Requirement: Change Command

The system SHALL provide a `change` command with subcommands for displaying, listing, and validating change proposals. Delta spec discovery within `ChangeParser.parseDeltaSpecs()` SHALL use recursive scanning to discover nested delta specs.

#### Scenario: Show change with nested delta specs as JSON

- **WHEN** executing `openspec change show my-change --json`
- **AND** the change has delta specs in nested directories (e.g., `specs/Client/Combat/combat-system/spec.md`)
- **THEN** recursively discover all delta spec files
- **AND** parse and include all deltas in the JSON output

#### Scenario: Show change with nested deltas-only

- **WHEN** executing `openspec change show my-change --json --deltas-only`
- **AND** the change has delta specs in nested directories
- **THEN** recursively discover and display all delta specs
- **AND** include the full relative path in the `spec` field of each delta

#### Scenario: Show change as JSON

- **WHEN** executing `openspec change show update-error --json`
- **THEN** parse the markdown change file
- **AND** extract change structure and deltas
- **AND** output valid JSON to stdout

#### Scenario: List all changes

- **WHEN** executing `openspec change list`
- **THEN** scan the openspec/changes directory
- **AND** return list of all pending changes
- **AND** support JSON output with `--json` flag

#### Scenario: Show only requirement changes

- **WHEN** executing `openspec change show update-error --requirements-only`
- **THEN** display only the requirement changes (ADDED/MODIFIED/REMOVED/RENAMED)
- **AND** exclude why and what changes sections

#### Scenario: Validate change structure

- **WHEN** executing `openspec change validate update-error`
- **THEN** parse the change file
- **AND** validate against Zod schema
- **AND** ensure deltas are well-formed
