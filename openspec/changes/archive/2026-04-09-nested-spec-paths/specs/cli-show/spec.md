## MODIFIED Requirements

### Requirement: Top-level show command

The CLI SHALL provide a top-level `show` command for displaying changes and specs with intelligent selection. Spec matching SHALL support both leaf names and full nested paths.

#### Scenario: Interactive show selection

- **WHEN** executing `openspec show` without arguments
- **THEN** prompt user to select type (change or spec)
- **AND** display list of available items for selected type
- **AND** show specs with full nested paths in the selection list
- **AND** show the selected item's content

#### Scenario: Non-interactive environments do not prompt

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `OPEN_SPEC_INTERACTIVE=0`
- **WHEN** executing `openspec show` without arguments
- **THEN** do not prompt
- **AND** print a helpful hint with examples for `openspec show <item>` or `openspec change/spec show`
- **AND** exit with code 1

#### Scenario: Direct item display by full path

- **WHEN** executing `openspec show Client/Combat/combat-system`
- **THEN** detect as a spec by matching against full nested paths
- **AND** display the spec's content

#### Scenario: Direct item display by leaf name

- **WHEN** executing `openspec show combat-system`
- **AND** only one spec has leaf directory name `combat-system`
- **THEN** resolve it to the full path and display it

#### Scenario: Ambiguous leaf name

- **WHEN** executing `openspec show combat-damage`
- **AND** multiple specs exist with leaf name `combat-damage` at different paths
- **THEN** display an ambiguity error listing all matching full paths
- **AND** exit with code 1

#### Scenario: Type detection and ambiguity handling

- **WHEN** executing `openspec show <item-name>`
- **THEN** if `<item-name>` uniquely matches a change or a spec (by full path or unique leaf name), show that item
- **AND** if it matches both, print an ambiguity error and suggest `--type change|spec` or using `openspec change show`/`openspec spec show`
- **AND** if it matches neither, print not-found with nearest-match suggestions

#### Scenario: Explicit type override

- **WHEN** executing `openspec show --type change <item>`
- **THEN** treat `<item>` as a change ID and show it (skipping auto-detection)

- **WHEN** executing `openspec show --type spec <item>`
- **THEN** treat `<item>` as a spec ID (full path or leaf name) and show it (skipping auto-detection)
