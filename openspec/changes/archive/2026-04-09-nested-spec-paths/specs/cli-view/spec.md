## MODIFIED Requirements

### Requirement: Dashboard Display

The system SHALL provide a `view` command that displays a dashboard overview of specs and changes. Spec discovery SHALL use recursive directory traversal.

#### Scenario: Basic dashboard display

- **WHEN** user runs `openspec view`
- **THEN** system recursively discovers all specs in `openspec/specs/` at any nesting depth
- **AND** displays a formatted dashboard with sections for summary, active changes, completed changes, and specifications
- **AND** shows specs with full relative paths

#### Scenario: No OpenSpec directory

- **WHEN** user runs `openspec view` in a directory without OpenSpec
- **THEN** system displays error message "✗ No openspec directory found"

### Requirement: Summary Section

The dashboard SHALL display a summary section with key project metrics, including draft change count. Spec counting SHALL include recursively discovered specs.

#### Scenario: Complete summary display

- **WHEN** dashboard is rendered with specs and changes
- **THEN** system shows total number of specifications (discovered recursively) and requirements
- **AND** shows number of draft changes
- **AND** shows number of active changes in progress
- **AND** shows number of completed changes
- **AND** shows overall task progress percentage
