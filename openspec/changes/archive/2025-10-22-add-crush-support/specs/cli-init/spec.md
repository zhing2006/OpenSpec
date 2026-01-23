## MODIFIED Requirements
### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/ogd/proposal.md`, `.claude/commands/ogd/apply.md`, and `.claude/commands/ogd/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for CodeBuddy Code
- **WHEN** the user selects CodeBuddy Code during initialization
- **THEN** create `.codebuddy/commands/ogd/proposal.md`, `.codebuddy/commands/ogd/apply.md`, and `.codebuddy/commands/ogd/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/ogd-proposal.md`, `.clinerules/ogd-apply.md`, and `.clinerules/ogd-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Cline-specific Markdown heading frontmatter
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Crush
- **WHEN** the user selects Crush during initialization
- **THEN** create `.crush/commands/ogd/proposal.md`, `.crush/commands/ogd/apply.md`, and `.crush/commands/ogd/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Crush-specific frontmatter with OGD category and tags
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/ogd-proposal.md`, `.cursor/commands/ogd-apply.md`, and `.cursor/commands/ogd-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/commands/ogd-proposal.md`, `.opencode/commands/ogd-apply.md`, and `.opencode/commands/ogd-archive.md`
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

#### Scenario: Generating slash commands for GitHub Copilot
- **WHEN** the user selects GitHub Copilot during initialization
- **THEN** create `.github/prompts/ogd-proposal.prompt.md`, `.github/prompts/ogd-apply.prompt.md`, and `.github/prompts/ogd-archive.prompt.md`
- **AND** populate each file with YAML frontmatter containing a `description` field that summarizes the workflow stage
- **AND** include `$ARGUMENTS` placeholder to capture user input
- **AND** wrap the shared template body with OGD markers so `ogd update` can refresh the content
- **AND** each template includes instructions for the relevant OGD workflow stage
