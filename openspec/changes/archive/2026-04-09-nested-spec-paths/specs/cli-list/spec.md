## MODIFIED Requirements

### Requirement: Command Execution

The command SHALL scan and analyze either active changes or specs based on the selected mode. Spec scanning SHALL use recursive directory traversal.

#### Scenario: Scanning for changes (default)

- **WHEN** `openspec list` is executed without flags
- **THEN** scan the `openspec/changes/` directory for change directories
- **AND** exclude the `archive/` subdirectory from results
- **AND** parse each change's `tasks.md` file to count task completion

#### Scenario: Scanning for specs with recursive discovery

- **WHEN** `openspec list --specs` is executed
- **THEN** recursively scan the `openspec/specs/` directory for capabilities at any nesting depth
- **AND** read each capability's `spec.md`
- **AND** parse requirements to compute requirement counts
- **AND** display specs with full relative paths (e.g., `Client/Combat/combat-system`)

### Requirement: Output Format

The command SHALL display items in a clear, readable table format with mode-appropriate progress or counts.

#### Scenario: Displaying change list (default)

- **WHEN** displaying the list of changes
- **THEN** show a table with columns:
  - Change name (directory name)
  - Task progress (e.g., "3/5 tasks" or "✓ Complete")

#### Scenario: Displaying spec list with nested paths

- **WHEN** displaying the list of specs
- **THEN** show a table with columns:
  - Spec id as full relative path (e.g., `Client/Combat/combat-system`)
  - Requirement count (e.g., "requirements 12")
