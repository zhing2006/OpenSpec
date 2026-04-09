## MODIFIED Requirements

### Requirement: Specs Sync Skill

The system SHALL provide an `/opsx:sync` skill that syncs delta specs from a change to the main specs. Delta spec discovery SHALL support nested directory structures, and target paths SHALL mirror the delta spec's relative path.

#### Scenario: Sync delta specs from nested directories

- **WHEN** agent executes `/opsx:sync` with a change name
- **AND** the change has delta specs in nested directories (e.g., `specs/Client/Combat/combat-system/spec.md`)
- **THEN** the agent reads delta specs by recursively scanning `openspec/changes/<name>/specs/`
- **AND** derives the target main spec path by mirroring the relative directory structure
- **AND** reads corresponding main specs from `openspec/specs/<relative-path>/spec.md`
- **AND** reconciles main specs to match what the deltas describe

#### Scenario: Sync delta specs from flat directories (backward compatibility)

- **WHEN** agent executes `/opsx:sync` with a change name
- **AND** the change has delta specs in flat directories (e.g., `specs/combat-system/spec.md`)
- **THEN** the agent reads delta specs from `openspec/changes/<name>/specs/`
- **AND** reconciles main specs at `openspec/specs/<capability>/spec.md`

#### Scenario: Idempotent operation

- **WHEN** agent executes `/opsx:sync` multiple times on the same change
- **THEN** the result is the same as running it once
- **AND** no duplicate requirements are created

#### Scenario: Change selection prompt

- **WHEN** agent executes `/opsx:sync` without specifying a change
- **THEN** the agent prompts user to select from available changes
- **AND** shows changes that have delta specs

### Requirement: Delta Reconciliation Logic

The agent SHALL reconcile main specs with delta specs using the delta operation headers. New spec files SHALL be created at the nested path that mirrors the delta spec's location.

#### Scenario: ADDED requirements

- **WHEN** delta contains `## ADDED Requirements` with a requirement
- **AND** the requirement does not exist in main spec
- **THEN** add the requirement to main spec

#### Scenario: ADDED requirement already exists

- **WHEN** delta contains `## ADDED Requirements` with a requirement
- **AND** a requirement with the same name already exists in main spec
- **THEN** update the existing requirement to match the delta version

#### Scenario: MODIFIED requirements

- **WHEN** delta contains `## MODIFIED Requirements` with a requirement
- **AND** the requirement exists in main spec
- **THEN** replace the requirement in main spec with the delta version

#### Scenario: REMOVED requirements

- **WHEN** delta contains `## REMOVED Requirements` with a requirement name
- **AND** the requirement exists in main spec
- **THEN** remove the requirement from main spec

#### Scenario: RENAMED requirements

- **WHEN** delta contains `## RENAMED Requirements` with FROM:/TO: format
- **AND** the FROM requirement exists in main spec
- **THEN** rename the requirement to the TO name

#### Scenario: New capability spec at nested path

- **WHEN** delta spec exists at `openspec/changes/<name>/specs/Client/Combat/combat-system/spec.md`
- **AND** no main spec exists at that path
- **THEN** create new main spec file at `openspec/specs/Client/Combat/combat-system/spec.md`
- **AND** create intermediate directories as needed

### Requirement: Skill Output

The skill SHALL provide clear feedback on what was applied, using full nested paths.

#### Scenario: Show applied changes

- **WHEN** reconciliation completes successfully
- **THEN** display summary of changes per capability using full nested paths:
  - Number of requirements added
  - Number of requirements modified
  - Number of requirements removed
  - Number of requirements renamed

#### Scenario: No changes needed

- **WHEN** main specs already match delta specs
- **THEN** display "Specs already in sync - no changes needed"
