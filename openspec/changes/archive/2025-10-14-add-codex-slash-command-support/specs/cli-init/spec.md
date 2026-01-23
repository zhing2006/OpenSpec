## MODIFIED Requirements
### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with OGD instructions using a marker system.
#### Scenario: Prompting for AI tool selection
- **WHEN** run interactively
- **THEN** prompt the user with "Which AI tools do you use?" using a multi-select menu
- **AND** list every available tool with a checkbox:
  - Claude Code (creates or refreshes CLAUDE.md and slash commands)
  - Cursor (creates or refreshes `.cursor/commands/*` slash commands)
  - OpenCode (creates or refreshes `.opencode/command/OGD-*.md` slash commands)
  - Windsurf (creates or refreshes `.windsurf/workflows/OGD-*.md` workflows)
  - Kilo Code (creates or refreshes `.kilocode/workflows/OGD-*.md` workflows)
  - Codex (creates or refreshes global prompts at `~/.codex/prompts/OGD-*.md`)
  - AGENTS.md standard (creates or refreshes AGENTS.md with OGD markers)
- **AND** show "(already configured)" beside tools whose managed files exist so users understand selections will refresh content
- **AND** treat disabled tools as "coming soon" and keep them unselectable
- **AND** allow confirming with Enter after selecting one or more tools

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/ogd/proposal.md`, `.claude/commands/ogd/apply.md`, and `.claude/commands/ogd/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/ogd-proposal.md`, `.cursor/commands/ogd-apply.md`, and `.cursor/commands/ogd-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/command/ogd-proposal.md`, `.opencode/command/ogd-apply.md`, and `.opencode/command/ogd-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Windsurf
- **WHEN** the user selects Windsurf during initialization
- **THEN** create `.windsurf/workflows/ogd-proposal.md`, `.windsurf/workflows/ogd-apply.md`, and `.windsurf/workflows/ogd-archive.md`
- **AND** populate each file from shared templates (wrapped in OGD markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Kilo Code
- **WHEN** the user selects Kilo Code during initialization
- **THEN** create `.kilocode/workflows/ogd-proposal.md`, `.kilocode/workflows/ogd-apply.md`, and `.kilocode/workflows/ogd-archive.md`
- **AND** populate each file from shared templates (wrapped in OGD markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Codex
- **WHEN** the user selects Codex during initialization
- **THEN** create global prompt files at `~/.codex/prompts/ogd-proposal.md`, `~/.codex/prompts/ogd-apply.md`, and `~/.codex/prompts/ogd-archive.md` (or under `$CODEX_HOME/prompts` if set)
- **AND** populate each file from shared templates that map the first numbered placeholder (`$1`) to the primary user input (e.g., change identifier or question text)
- **AND** wrap the generated content in OGD markers so `ogd update` can refresh the prompts without touching surrounding custom notes
