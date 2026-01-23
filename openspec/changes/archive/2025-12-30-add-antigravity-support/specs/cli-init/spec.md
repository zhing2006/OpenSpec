# Delta for CLI Init

## MODIFIED Requirements
### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Antigravity
- **WHEN** the user selects Antigravity during initialization
- **THEN** create `.agent/workflows/ogd-proposal.md`, `.agent/workflows/ogd-apply.md`, and `.agent/workflows/ogd-archive.md`
- **AND** ensure each file begins with YAML frontmatter that contains only a `description: <stage summary>` field followed by the shared OGD workflow instructions wrapped in managed markers
- **AND** populate the workflow body with the same proposal/apply/archive guidance used for other tools so Antigravity behaves like Windsurf while pointing to the `.agent/workflows/` directory

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

#### Scenario: Generating slash commands for Factory Droid
- **WHEN** the user selects Factory Droid during initialization
- **THEN** create `.factory/commands/ogd-proposal.md`, `.factory/commands/ogd-apply.md`, and `.factory/commands/ogd-archive.md`
- **AND** populate each file from shared templates that include Factory-compatible YAML frontmatter for the `description` and `argument-hint` fields
- **AND** include the `$ARGUMENTS` placeholder in the template body so droid receives any user-supplied input
- **AND** wrap the generated content in OGD managed markers so `ogd update` can safely refresh the commands

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

#### Scenario: Generating slash commands for Gemini CLI
- **WHEN** the user selects Gemini CLI during initialization
- **THEN** create `.gemini/commands/ogd/proposal.toml`, `.gemini/commands/ogd/apply.toml`, and `.gemini/commands/ogd/archive.toml`
- **AND** populate each file as TOML that sets a stage-specific `description = "<summary>"` and a multi-line `prompt = """` block with the shared OGD template
- **AND** wrap the OGD managed markers (`<!-- OGD:START -->` / `<!-- OGD:END -->`) inside the `prompt` value so `ogd update` can safely refresh the body between markers without touching the TOML framing
- **AND** ensure the slash-command copy matches the existing proposal/apply/archive templates used by other tools

#### Scenario: Generating slash commands for iFlow CLI
- **WHEN** the user selects iFlow CLI during initialization
- **THEN** create `.iflow/commands/ogd-proposal.md`, `.iflow/commands/ogd-apply.md`, and `.iflow/commands/ogd-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include YAML frontmatter with `name`, `id`, `category`, and `description` fields for each command
- **AND** wrap the generated content in OGD managed markers so `ogd update` can safely refresh the commands
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for RooCode
- **WHEN** the user selects RooCode during initialization
- **THEN** create `.roo/commands/ogd-proposal.md`, `.roo/commands/ogd-apply.md`, and `.roo/commands/ogd-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include simple Markdown headings (e.g., `# OGD: Proposal`) without YAML frontmatter
- **AND** wrap the generated content in OGD managed markers where applicable so `ogd update` can safely refresh the commands
- **AND** each template includes instructions for the relevant OGD workflow stage
