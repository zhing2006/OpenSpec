## MODIFIED Requirements

### Requirement: Top-level validate command

The CLI SHALL provide a top-level `validate` command for validating changes and specs with flexible selection options. Spec matching SHALL support both leaf names and full nested paths.

#### Scenario: Interactive validation selection

- **WHEN** executing `openspec validate` without arguments
- **THEN** prompt user to select what to validate (all, changes, specs, or specific item)
- **AND** display specs with full nested paths in the selection list
- **AND** perform validation based on selection
- **AND** display results with appropriate formatting

#### Scenario: Non-interactive environments do not prompt

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `OPEN_SPEC_INTERACTIVE=0`
- **WHEN** executing `openspec validate` without arguments
- **THEN** do not prompt interactively
- **AND** print a helpful hint listing available commands/flags and exit with code 1

#### Scenario: Direct item validation by full path

- **WHEN** executing `openspec validate Client/Combat/combat-system`
- **THEN** detect as a spec by matching against full nested paths
- **AND** validate the specified spec

#### Scenario: Direct item validation by leaf name

- **WHEN** executing `openspec validate combat-system`
- **AND** only one spec has leaf directory name `combat-system`
- **THEN** resolve it to the full path and validate it

#### Scenario: Ambiguous leaf name

- **WHEN** executing `openspec validate combat-damage`
- **AND** multiple specs exist with leaf name `combat-damage` at different paths
- **THEN** display an ambiguity error listing all matching full paths
- **AND** exit with code 1

### Requirement: Bulk and filtered validation

The validate command SHALL support flags for bulk validation (--all) and filtered validation by type (--changes, --specs). Spec discovery SHALL use recursive scanning.

#### Scenario: Validate everything

- **WHEN** executing `openspec validate --all`
- **THEN** validate all changes in openspec/changes/ (excluding archive)
- **AND** recursively validate all specs in openspec/specs/ (including nested directories)
- **AND** display a summary showing passed/failed items with full paths
- **AND** exit with code 1 if any validation fails

#### Scenario: Scope of bulk validation

- **WHEN** validating with `--all` or `--changes`
- **THEN** include all change proposals under `openspec/changes/`
- **AND** exclude the `openspec/changes/archive/` directory

- **WHEN** validating with `--specs`
- **THEN** recursively include all specs that have a `spec.md` under `openspec/specs/`
- **AND** scan nested directories at arbitrary depth

#### Scenario: Validate all changes

- **WHEN** executing `openspec validate --changes`
- **THEN** validate all changes in openspec/changes/ (excluding archive)
- **AND** display results for each change
- **AND** show summary statistics

#### Scenario: Validate all specs

- **WHEN** executing `openspec validate --specs`
- **THEN** recursively validate all specs in openspec/specs/
- **AND** display results for each spec with full nested path
- **AND** show summary statistics

### Requirement: Item type detection and ambiguity handling

The validate command SHALL handle ambiguous names and explicit type overrides to ensure clear, deterministic behavior. Spec matching SHALL support both leaf names and full nested paths.

#### Scenario: Direct item validation with automatic type detection

- **WHEN** executing `openspec validate <item-name>`
- **THEN** if `<item-name>` uniquely matches a change or a spec (by full path or unique leaf name), validate that item

#### Scenario: Ambiguity between change and spec names

- **GIVEN** `<item-name>` exists both as a change and as a spec
- **WHEN** executing `openspec validate <item-name>`
- **THEN** print an ambiguity error explaining both matches
- **AND** suggest passing `--type change` or `--type spec`, or using `openspec change validate` / `openspec spec validate`
- **AND** exit with code 1 without performing validation

#### Scenario: Unknown item name

- **WHEN** the `<item-name>` matches neither a change nor a spec (checked by full path and leaf name)
- **THEN** print a not-found error
- **AND** show nearest-match suggestions when available
- **AND** exit with code 1

#### Scenario: Explicit type override

- **WHEN** executing `openspec validate --type change <item>`
- **THEN** treat `<item>` as a change ID and validate it (skipping auto-detection)

- **WHEN** executing `openspec validate --type spec <item>`
- **THEN** treat `<item>` as a spec ID (full path or leaf name) and validate it (skipping auto-detection)

## ADDED Requirements

### Requirement: Delta spec validation SHALL support nested directory structure

The validator SHALL recursively discover delta spec files within a change's `specs/` directory, supporting arbitrary nesting depth to mirror the target spec tree structure.

#### Scenario: Validate delta specs in nested directories

- **WHEN** validating a change that has delta specs at `openspec/changes/<name>/specs/Client/Combat/combat-system/spec.md`
- **THEN** discover and validate the delta spec
- **AND** report issues with the full relative path (e.g., `Client/Combat/combat-system/spec.md`)

#### Scenario: Validate delta specs in flat directories (backward compatibility)

- **WHEN** validating a change that has delta specs at `openspec/changes/<name>/specs/combat-system/spec.md`
- **THEN** discover and validate the delta spec as before
- **AND** maintain backward compatibility with flat structure

#### Scenario: Validate delta specs on Windows paths

- **WHEN** validating a change on Windows
- **THEN** use `path.join()` for all path construction
- **AND** normalize path separators when comparing or reporting paths
