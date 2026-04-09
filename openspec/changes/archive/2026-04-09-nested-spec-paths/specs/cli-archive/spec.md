## MODIFIED Requirements

### Requirement: Archive Validation

The archive command SHALL validate changes before applying them to ensure data integrity. Pre-validation delta spec detection SHALL use recursive scanning to discover nested delta specs.

#### Scenario: Pre-validation discovers nested delta specs

- **WHEN** executing `openspec archive change-name`
- **AND** the change has delta specs only in nested directories (e.g., `specs/Client/Combat/combat-system/spec.md`)
- **THEN** recursively scan the change's `specs/` directory to detect delta spec presence
- **AND** run `validateChangeDeltaSpecs()` if any are found
- **AND** block archive if validation fails

#### Scenario: Pre-validation discovers flat delta specs (backward compatibility)

- **WHEN** executing `openspec archive change-name`
- **AND** the change has delta specs in flat directories (e.g., `specs/combat-system/spec.md`)
- **THEN** detect delta spec presence as before
- **AND** run validation

#### Scenario: Force archive without validation

- **WHEN** executing `openspec archive change-name --no-validate`
- **THEN** skip validation (unsafe mode)
- **AND** show warning about skipping validation

### Requirement: Spec Update Process

Before moving the change to archive, the command SHALL apply delta changes to main specs to reflect the deployed reality. Delta spec discovery SHALL support nested directory structures.

#### Scenario: Discovering delta specs in nested directories

- **WHEN** archiving a change with delta specs at `openspec/changes/<name>/specs/Client/Combat/combat-system/spec.md`
- **THEN** recursively discover the delta spec
- **AND** derive the target path as `openspec/specs/Client/Combat/combat-system/spec.md` by mirroring the relative directory structure

#### Scenario: Discovering delta specs in flat directories (backward compatibility)

- **WHEN** archiving a change with delta specs at `openspec/changes/<name>/specs/combat-system/spec.md`
- **THEN** discover the delta spec
- **AND** derive the target path as `openspec/specs/combat-system/spec.md`

#### Scenario: Applying delta changes

- **WHEN** archiving a change with delta-based specs
- **THEN** parse and apply delta changes as defined in openspec-conventions
- **AND** validate all operations before applying

#### Scenario: Validating delta changes

- **WHEN** processing delta changes
- **THEN** perform validations as specified in openspec-conventions
- **AND** if validation fails, show specific errors and abort

#### Scenario: Conflict detection

- **WHEN** applying deltas would create duplicate requirement headers
- **THEN** abort with error message showing the conflict
- **AND** suggest manual resolution

#### Scenario: Creating nested target directories

- **WHEN** applying delta for a new spec at a nested path (e.g., `Client/Combat/combat-system`)
- **AND** the intermediate directories do not exist
- **THEN** create the full nested directory structure under `openspec/specs/`
- **AND** write the new spec file

#### Scenario: Cross-platform path handling

- **WHEN** discovering delta specs and deriving target paths on Windows
- **THEN** use `path.join()` for all path construction
- **AND** normalize path separators consistently

### Requirement: Confirmation Behavior

The spec update confirmation SHALL provide clear visibility into changes before they are applied. Display SHALL use full nested paths.

#### Scenario: Displaying confirmation

- **WHEN** prompting for confirmation
- **THEN** display a clear summary showing:
  - Which specs will be created (new capabilities) with full nested paths
  - Which specs will be updated (existing capabilities) with full nested paths
  - The source path for each spec
- **AND** format the confirmation prompt as:
  ```
  The following specs will be updated:

  NEW specs to be created:
    - Client/Combat/combat-system (from changes/add-combat/specs/Client/Combat/combat-system/spec.md)

  EXISTING specs to be updated:
    - Client/UI/hud-system (from changes/update-hud/specs/Client/UI/hud-system/spec.md)

  Proceed with spec updates? [Y/n]:
  ```

#### Scenario: Handling confirmation response

- **WHEN** waiting for user confirmation
- **THEN** default to "Yes"
- **AND** skip confirmation when `--yes` or `-y` flag is provided

#### Scenario: User declines confirmation

- **WHEN** user declines the confirmation
- **THEN** skip spec updates
- **AND** proceed with the archive operation
- **AND** display message: "Skipping spec updates. Proceeding with archive."

### Requirement: Display Output

The command SHALL provide clear feedback about delta operations using full nested paths.

#### Scenario: Showing delta application

- **WHEN** applying delta changes
- **THEN** display for each spec using its full nested path:
  - Number of requirements added
  - Number of requirements modified
  - Number of requirements removed
  - Number of requirements renamed
- **AND** use standard output symbols (+ ~ - →) as defined in openspec-conventions:
  ```
  Applying changes to specs/Client/Combat/combat-system/spec.md:
    + 2 added
    ~ 3 modified
    - 1 removed
    → 1 renamed
  ```
