# CLI Archive Command Specification

## Purpose
The archive command moves completed changes from the active changes directory to the archive folder with date-based naming, following OpenSpec conventions.

## Command Syntax
```bash
openspec archive [change-name] [--yes|-y]
```

Options:
- `--yes`, `-y`: Skip confirmation prompts (for automation)
## Requirements
### Requirement: Change Selection

The command SHALL support both interactive and direct change selection methods.

#### Scenario: Interactive selection

- **WHEN** no change-name is provided
- **THEN** display interactive list of available changes (excluding archive/)
- **AND** allow user to select one

#### Scenario: Direct selection

- **WHEN** change-name is provided
- **THEN** use that change directly
- **AND** validate it exists

### Requirement: Task Completion Check

The command SHALL verify task completion status before archiving to prevent premature archival.

#### Scenario: Incomplete tasks found

- **WHEN** incomplete tasks are found (marked with `- [ ]`)
- **THEN** display all incomplete tasks to the user
- **AND** prompt for confirmation to continue
- **AND** default to "No" for safety

#### Scenario: All tasks complete

- **WHEN** all tasks are complete OR no tasks.md exists
- **THEN** proceed with archiving without prompting

### Requirement: Archive Process

The archive operation SHALL follow a structured process to safely move changes to the archive.

#### Scenario: Performing archive

- **WHEN** archiving a change
- **THEN** execute these steps:
  1. Create archive/ directory if it doesn't exist
  2. Generate target name as `YYYY-MM-DD-[change-name]` using current date
  3. Check if target directory already exists
  4. Update main specs from the change's future state specs (see Spec Update Process below)
  5. Move the entire change directory to the archive location

#### Scenario: Archive already exists

- **WHEN** target archive already exists
- **THEN** fail with error message
- **AND** do not overwrite existing archive

#### Scenario: Successful archive

- **WHEN** move succeeds
- **THEN** display success message with archived name and list of updated specs

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

### Requirement: Error Conditions

The command SHALL handle various error conditions gracefully.

#### Scenario: Handling errors

- **WHEN** errors occur
- **THEN** handle the following conditions:
  - Missing openspec/changes/ directory
  - Change not found
  - Archive target already exists
  - File system permissions issues

### Requirement: Skip Specs Option

The archive command SHALL support a `--skip-specs` flag that skips all spec update operations and proceeds directly to archiving.

#### Scenario: Skipping spec updates with flag

- **WHEN** executing `openspec archive <change> --skip-specs`
- **THEN** skip spec discovery and update confirmation
- **AND** proceed directly to moving the change to archive
- **AND** display a message indicating specs were skipped

### Requirement: Non-blocking confirmation

The archive operation SHALL proceed when the user declines spec updates instead of cancelling the entire operation.

#### Scenario: User declines spec update confirmation

- **WHEN** the user declines spec update confirmation
- **THEN** skip spec updates
- **AND** continue with the archive operation
- **AND** display a success message indicating specs were not updated

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

## Why These Decisions

**Interactive selection**: Reduces typing and helps users see available changes
**Task checking**: Prevents accidental archiving of incomplete work
**Date prefixing**: Maintains chronological order and prevents naming conflicts
**No overwrite**: Preserves historical archives and prevents data loss
**Spec updates before archiving**: Specs in the main directory represent current reality; when a change is deployed and archived, its future state specs become the new reality and must replace the main specs
**Confirmation for spec updates**: Provides visibility into what will change, prevents accidental overwrites, and ensures users understand the impact before specs are modified
**--yes flag for automation**: Allows CI/CD pipelines to archive without interactive prompts while maintaining safety by default for manual use