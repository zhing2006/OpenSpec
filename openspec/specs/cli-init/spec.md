# CLI Init Specification

## Purpose

The `ogd init` command SHALL create a complete OGD directory structure in any project, enabling immediate adoption of OGD conventions with support for multiple AI coding assistants.
## Requirements
### Requirement: Progress Indicators

The command SHALL display progress indicators during initialization to provide clear feedback about each step.

#### Scenario: Displaying initialization progress

- **WHEN** executing initialization steps
- **THEN** validate environment silently in background (no output unless error)
- **AND** display progress with ora spinners:
  - Show spinner: "⠋ Creating OGD structure..."
  - Then success: "✔ OGD structure created"
  - Show spinner: "⠋ Configuring AI tools..."
  - Then success: "✔ AI tools configured"

### Requirement: Directory Creation
The command SHALL create the complete OGD directory structure with all required directories and files.

#### Scenario: Creating OGD structure
- **WHEN** `ogd init` is executed
- **THEN** create the following directory structure:
```
ogd/
├── project.md
├── AGENTS.md
├── specs/
└── changes/
    └── archive/
```

### Requirement: File Generation
The command SHALL generate required template files with appropriate content for immediate use.

#### Scenario: Generating template files
- **WHEN** initializing OGD
- **THEN** generate `ogd/AGENTS.md` containing complete OGD instructions for AI assistants
- **AND** generate `project.md` with project context template

### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with OGD instructions using a grouped selection experience so teams can enable native integrations while always provisioning guidance for other assistants.

#### Scenario: Prompting for AI tool selection
- **WHEN** run interactively
- **THEN** present a multi-select wizard that separates options into two headings:
  - **Natively supported providers** shows each available first-party integration (Claude Code, Cursor, OpenCode, …) with checkboxes
  - **Other tools** explains that the root-level `AGENTS.md` stub is always generated for AGENTS-compatible assistants and cannot be deselected
- **AND** mark already configured native tools with "(already configured)" to signal that choosing them will refresh managed content
- **AND** keep disabled or unavailable providers labelled as "coming soon" so users know they cannot opt in yet
- **AND** allow confirming the selection even when no native provider is chosen because the root stub remains enabled by default
- **AND** change the base prompt copy in extend mode to "Which natively supported AI tools would you like to add or refresh?"

### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with OGD-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside ogd/)
- **AND** populate the managed block with a short stub that points teammates to `@/ogd/AGENTS.md`

#### Scenario: Configuring CodeBuddy Code

- **WHEN** CodeBuddy Code is selected
- **THEN** create or update `CODEBUDDY.md` in the project root directory (not inside ogd/)
- **AND** populate the managed block with a short stub that points teammates to `@/ogd/AGENTS.md`

#### Scenario: Configuring Cline

- **WHEN** Cline is selected
- **THEN** create or update `CLINE.md` in the project root directory (not inside ogd/)
- **AND** populate the managed block with a short stub that points teammates to `@/ogd/AGENTS.md`

#### Scenario: Configuring iFlow CLI

- **WHEN** iFlow CLI is selected
- **THEN** create or update `IFLOW.md` in the project root directory (not inside ogd/)
- **AND** populate the managed block with a short stub that points teammates to `@/ogd/AGENTS.md`

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with stub instructions wrapped in markers so the full workflow stays in `ogd/AGENTS.md`:
```markdown
<!-- OGD:START -->
# OGD Instructions

This project uses OGD to manage AI assistant workflows.

- Full guidance lives in '@/ogd/AGENTS.md'.
- Keep this managed block so 'ogd update' can refresh the instructions.
<!-- OGD:END -->
```

### Requirement: Interactive Mode
The command SHALL provide an interactive menu for AI tool selection with clear navigation instructions.
#### Scenario: Displaying interactive menu
- **WHEN** run in fresh or extend mode
- **THEN** present a looping select menu that lets users toggle tools with Space and review selections with Enter
- **AND** when Enter is pressed on a highlighted selectable tool that is not already selected, automatically add it to the selection before moving to review so the highlighted tool is configured
- **AND** label already configured tools with "(already configured)" while keeping disabled options marked "coming soon"
- **AND** change the prompt copy in extend mode to "Which AI tools would you like to add or refresh?"
- **AND** display inline instructions clarifying that Space toggles tools and Enter selects the highlighted tool before reviewing selections

### Requirement: Safety Checks
The command SHALL perform safety checks to prevent overwriting existing structures and ensure proper permissions.

#### Scenario: Detecting existing initialization
- **WHEN** the `ogd/` directory already exists
- **THEN** inform the user that OGD is already initialized, skip recreating the base structure, and enter an extend mode
- **AND** continue to the AI tool selection step so additional tools can be configured
- **AND** display the existing-initialization error message only when the user declines to add any AI tools

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message
- **WHEN** initialization completes successfully
- **THEN** include prompt: "Please explain the OGD workflow from ogd/AGENTS.md and how I should work with you on this project"

#### Scenario: Displaying restart instruction
- **WHEN** initialization completes successfully and tools were created or refreshed
- **THEN** display a prominent restart instruction before the "Next steps" section
- **AND** inform users that slash commands are loaded at startup
- **AND** instruct users to restart their coding assistant to ensure /OGD commands appear

### Requirement: Exit Codes

The command SHALL use consistent exit codes to indicate different failure modes.

#### Scenario: Returning exit codes

- **WHEN** the command completes
- **THEN** return appropriate exit code:
  - 0: Success
  - 1: General error (including when OGD directory already exists)
  - 2: Insufficient permissions (reserved for future use)
  - 3: User cancelled operation (reserved for future use)

### Requirement: Additional AI Tool Initialization
`ogd init` SHALL allow users to add configuration files for new AI coding assistants after the initial setup.

#### Scenario: Configuring an extra tool after initial setup
- **GIVEN** an `ogd/` directory already exists and at least one AI tool file is present
- **WHEN** the user runs `ogd init` and selects a different supported AI tool
- **THEN** generate that tool's configuration files with OGD markers the same way as during first-time initialization
- **AND** leave existing tool configuration files unchanged except for managed sections that need refreshing
- **AND** exit with code 0 and display a success summary highlighting the newly added tool files

### Requirement: Success Output Enhancements
`ogd init` SHALL summarize tool actions when initialization or extend mode completes.

#### Scenario: Showing tool summary
- **WHEN** the command completes successfully
- **THEN** display a categorized summary of tools that were created, refreshed, or skipped (including already-configured skips)
- **AND** personalize the "Next steps" header using the names of the selected tools, defaulting to a generic label when none remain

### Requirement: Exit Code Adjustments
`ogd init` SHALL treat extend mode without new native tool selections as a successful refresh.

#### Scenario: Allowing empty extend runs
- **WHEN** OGD is already initialized and the user selects no additional natively supported tools
- **THEN** complete successfully while refreshing the root `AGENTS.md` stub
- **AND** exit with code 0

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
- **AND** populate each file from shared templates that include CodeBuddy-compatible YAML frontmatter for the `description` and `argument-hint` fields
- **AND** use square bracket format for `argument-hint` parameters (e.g., `[change-id]`)
- **AND** each template includes instructions for the relevant OGD workflow stage

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/workflows/ogd-proposal.md`, `.clinerules/workflows/ogd-apply.md`, and `.clinerules/workflows/ogd-archive.md`
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

#### Scenario: Generating slash commands for Continue
- **WHEN** the user selects Continue during initialization
- **THEN** create `.continue/prompts/ogd-proposal.prompt`, `.continue/prompts/ogd-apply.prompt`, and `.continue/prompts/ogd-archive.prompt`
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

### Requirement: Non-Interactive Mode
The command SHALL support non-interactive operation through command-line options for automation and CI/CD use cases.

#### Scenario: Select all tools non-interactively
- **WHEN** run with `--tools all`
- **THEN** automatically select every available AI tool without prompting
- **AND** proceed with initialization using the selected tools

#### Scenario: Select specific tools non-interactively
- **WHEN** run with `--tools claude,cursor`
- **THEN** parse the comma-separated tool IDs and validate against available tools
- **AND** proceed with initialization using only the specified valid tools

#### Scenario: Skip tool configuration non-interactively
- **WHEN** run with `--tools none`
- **THEN** skip AI tool configuration entirely
- **AND** only create the OGD directory structure and template files

#### Scenario: Invalid tool specification
- **WHEN** run with `--tools` containing any IDs not present in the AI tool registry
- **THEN** exit with code 1 and display available values (`all`, `none`, or the supported tool IDs)

#### Scenario: Help text lists available tool IDs
- **WHEN** displaying CLI help for `ogd init`
- **THEN** show the `--tools` option description with the valid values derived from the AI tool registry

### Requirement: Root instruction stub
`ogd init` SHALL always scaffold the root-level `AGENTS.md` hand-off so every teammate finds the primary OGD instructions.

#### Scenario: Creating root `AGENTS.md`
- **GIVEN** the project may or may not already contain an `AGENTS.md` file
- **WHEN** initialization completes in fresh or extend mode
- **THEN** create or refresh `AGENTS.md` at the repository root using the managed marker block from `TemplateManager.getAgentsStandardTemplate()`
- **AND** preserve any existing content outside the managed markers while replacing the stub text inside them
- **AND** create the stub regardless of which native AI tools are selected

## Why

Manual creation of OGD structure is error-prone and creates adoption friction. A standardized init command ensures:
- Consistent structure across all projects
- Proper AI instruction files are always included
- Quick onboarding for new projects
- Clear conventions from the start
