## MODIFIED Requirements
### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with OGD instructions based on user selection.

#### Scenario: Prompting for AI tool selection

- **WHEN** run
- **THEN** prompt user to select AI tools to configure:
  - Claude Code (✅ OGD custom slash commands available)
  - Cursor (✅ OGD custom slash commands available)
  - AGENTS.md (works with Codex, Amp, Copilot, …)

### Requirement: AI Tool Configuration Details
The command SHALL properly configure selected AI tools with OGD-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside ogd/)

#### Scenario: Configuring AGENTS standard

- **WHEN** the AGENTS.md standard is selected
- **THEN** create or update `AGENTS.md` in the project root directory (not inside ogd/)

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with OGD content wrapped in markers:
```markdown
<!-- OGD:START -->
# OGD Project

This document provides instructions for AI coding assistants on how to use OGD conventions for spec-driven development. Follow these rules precisely when working on OGD-enabled projects.

This project uses OGD for spec-driven development. Specifications are the source of truth.

See @ogd/AGENTS.md for detailed conventions and guidelines.
<!-- OGD:END -->
```

#### Scenario: Creating new AGENTS.md

- **WHEN** AGENTS.md does not exist in the project root
- **THEN** create new file with OGD content wrapped in markers using the same template as CLAUDE.md

#### Scenario: Updating existing CLAUDE.md

- **WHEN** CLAUDE.md already exists
- **THEN** preserve all existing content
- **AND** insert OGD content at the beginning of the file using markers
- **AND** ensure markers don't duplicate if they already exist

#### Scenario: Updating existing AGENTS.md

- **WHEN** AGENTS.md already exists in the project root
- **THEN** preserve all existing content
- **AND** ensure the OGD-managed block at the beginning of the file is refreshed without duplicating markers

#### Scenario: Managing content with markers

- **WHEN** using the marker system
- **THEN** use `<!-- OGD:START -->` to mark the beginning of managed content
- **AND** use `<!-- OGD:END -->` to mark the end of managed content
- **AND** allow OGD to update its content without affecting user customizations
- **AND** preserve all content outside the markers intact

WHY use markers:
- Users may have existing CLAUDE.md or AGENTS.md instructions they want to keep
- OGD can update its instructions in future versions
- Clear boundary between OGD-managed and user-managed content
