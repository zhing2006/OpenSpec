export const agentsTemplate = `# OGD (OpenGameDesign) Game Design Workflow Guide

Instructions for AI assistants using OGD for spec-driven game design.

## Quick Checklist

- Check existing work: \`ogd list --long\`, \`ogd list --specs\`
- Decide scope: new capability vs modify existing capability
- Pick a unique \`change-id\`: kebab-case, verb-led (\`add-\`, \`update-\`, \`remove-\`)
- Scaffold: \`proposal.md\`, \`tasks.md\`, \`design.md\` (optional), and delta specs
- Write deltas: use \`## ADDED|MODIFIED|REMOVED Requirements\`; at least one \`#### Scenario:\` per requirement
- Validate: \`ogd validate [change-id] --strict --no-interactive\`
- Request approval: Do not start implementation until proposal is approved

## Game Design Workflow

### Core Principles

1. **Experience over implementation** - Focus on "what players do" and "what players feel", NOT "how to implement"
2. **Pillar-driven validation** - All design decisions must align with design pillars
3. **Dual spec types** - Global specs (game-vision) + Feature specs
4. **Technology-agnostic** - Output design documents, no technical implementation details

### Key Concept: Spec vs Artifact

**IMPORTANT**: Understand the difference between specs and artifacts:

| Type | Location | Purpose | Content |
|------|----------|---------|---------|
| **Spec** | \`ogd/specs/\` | Design requirements & constraints | WHAT to achieve, scenarios, acceptance criteria |
| **Artifact** | \`docs/\` | Final design documents | HOW the design works, detailed mechanics, numbers |

- **Specs are NOT the final deliverables** - they define requirements and scenarios
- **Artifacts in \`docs/\` are the final game design documents** - the actual deliverables for development team
- Workflow: Write specs first → Generate artifacts based on specs

### Workflow Order

\`\`\`
1. Define design pillars (pillars.md)
   ↓
2. Create game vision spec (specs/game-vision/spec.md)
   ↓
3. Create feature specs (specs/[feature]/spec.md)
   ↓
4. Generate design artifacts (docs/)
\`\`\`

## Three-Stage Workflow

### Stage 1: Create Change Proposal

Create a proposal when:
- Adding new game features or systems
- Modifying existing feature behavior
- Adjusting worldbuilding or core settings
- Changing numerical framework

**Workflow**
1. Read \`ogd/pillars.md\` to understand design pillars
2. Run \`ogd list --specs\` to view existing specs
3. Create \`changes/<change-id>/\` directory
4. Write \`proposal.md\`, \`tasks.md\`, and delta specs
5. Run \`ogd validate <id> --strict --no-interactive\` to validate

### Stage 2: Implement Design Tasks

1. **Read proposal.md** - Understand design goals
2. **Read design.md** (if exists) - Review design decisions
3. **Read tasks.md** - Get task checklist
4. **Complete tasks in order** - Generate design artifacts
5. **Update task status** - Mark \`- [x]\` when done

### Stage 3: Archive Changes

After completion:
- Run \`ogd archive <change-id> --yes\`
- Specs will be automatically merged into \`specs/\`

## Directory Structure

\`\`\`
ogd/
├── pillars.md              # Design pillars (core principles)
├── specs/                  # Finalized specs
│   ├── game-vision/        # Global spec (game vision)
│   │   └── spec.md
│   └── [feature]/          # Feature specs
│       └── spec.md
├── changes/                # Change proposals
│   ├── [change-name]/
│   │   ├── proposal.md     # Why the change
│   │   ├── tasks.md        # Task checklist
│   │   ├── design.md       # Design decisions (optional)
│   │   └── specs/          # Delta specs
│   └── archive/            # Archived changes
└── AGENTS.md               # This file

docs/                       # Design artifact output
├── game-vision/            # Global design artifacts
│   ├── game-vision.md          # Game vision document
│   ├── core-loop.md            # Core gameplay loop
│   ├── world-setting.md        # World setting
│   └── emotional-curve.md      # Emotional curve design
└── [feature]/              # Feature design artifacts
    ├── gameplay-design.md      # Gameplay design
    ├── numerical-framework.md  # Numerical framework
    ├── balance-analysis.md     # Balance analysis
    ├── system-integration.md   # System integration
    └── narrative-design.md     # Narrative design (if applicable)
\`\`\`

## Design Pillars (pillars.md)

Design pillars are the game's "creative constitution". All features must align with these principles.

**Structure example**:
\`\`\`markdown
# Game Design Pillars: [Game Name]

## Core Experience Goal
[Describe the core emotions players should feel after completing the game]

## Design Pillars

### Pillar 1: [Name]
[Describe what this pillar represents]
**Rationale**: [Why this pillar matters]

### Pillar 2: [Name]
...
\`\`\`

**Quantity guidelines**:
- Small games: 1-2 pillars
- Indie games: 2-4 pillars
- Large projects: 4-7 pillars

## Spec Types

### Global Spec (game-vision)

Game vision spec defines the overall game experience:

\`\`\`markdown
# Game Vision Design Spec

**Type**: Global

## Vision

### Game Type and Subtype
[Describe the game's core type]

### Core Gameplay Loop
Explore → Combat → Gather Resources → Upgrade Equipment → Explore Deeper

### Emotional Curve
[Describe emotional changes during gameplay]

### Experience Goal
[Describe what players should feel after completing the game]

## World

### World Setting
[Time, place, technology level, core rules]

### Core Conflict
[Main conflict driving narrative and gameplay]

### Art Style Direction
[Visual style positioning and reference works]

## ADDED Requirements
...
\`\`\`

### Feature Specs

Feature specs MUST depend on game-vision:

\`\`\`markdown
# [Feature Name] Design Spec

**Type**: Feature

## Spec Dependencies

- **game-vision** - Game vision (required)
- [Other dependent specs]

## Vision

### Core Goal
[What experience goal this feature achieves]

### Position in Core Loop
[This feature's role in the overall gameplay loop]

## World

### World Position
[This feature's background in the game world]

### Art/Audio Direction
[Visual and audio style for this feature]

## ADDED Requirements

### Requirement: [Requirement Name]
The system SHALL [describe specific capability]

#### Scenario: [Scenario Name]
- **GIVEN** [Initial state]
- **WHEN** [Player action]
- **THEN** [Expected result]

## User Stories

### User Story 1 - [Title] (Priority: P1)
[Describe player experience]
**Why this priority**: [Explain value]
\`\`\`

## Design Artifact Types

| Artifact | Filename | Description |
|----------|----------|-------------|
| Gameplay Design | gameplay-design.md | Core gameplay, operation flow |
| Numerical Framework | numerical-framework.md | Formulas, parameters, balance |
| Balance Analysis | balance-analysis.md | Risk/reward, strategy balance |
| System Integration | system-integration.md | Interactions with other systems |
| Narrative Design | narrative-design.md | Story, dialogue, characters |
| World Setting | world-setting.md | Detailed worldbuilding |
| Core Loop | core-loop.md | Detailed gameplay loop |
| Emotional Curve | emotional-curve.md | Experience rhythm design |

## Change Proposal Structure

### proposal.md
\`\`\`markdown
# Design Change Proposal: [Change Name]

## Why
[1-2 sentences describing the problem or opportunity]

## What Changes
- [Change 1]
- [Change 2]
- **BREAKING**: [Breaking changes]

## Capabilities

### New Capabilities
- \`[capability-name]\`: [Description]

### Modified Capabilities
- \`[existing-capability]\`: [Change description]

## Impact
- **Affected systems**: [List]
- **Dependencies**: [List]
\`\`\`

### tasks.md
\`\`\`markdown
# Design Task Checklist: [Feature Name]

## 1. Preparation
- [ ] 1.1 Verify design pillar alignment
- [ ] 1.2 Confirm dependent specs are complete

## 2. Core Design
- [ ] 2.1 Write gameplay design document
- [ ] 2.2 Build numerical framework

## 3. User Story - [US1 Title]
- [ ] 3.1 [Task description]
- [ ] 3.2 [Task description]

## 4. Balance and Polish
- [ ] 4.1 Conduct balance analysis
- [ ] 4.2 Verify consistency with design pillars
\`\`\`

### design.md (optional)
Create when:
- Complex numerical design
- Multi-system interaction
- Major design decisions

\`\`\`markdown
# Design Decisions: [Feature Name]

## Context
[Current state, constraints]

## Goals / Non-Goals
- **Goals**: [What to achieve]
- **Non-Goals**: [What to exclude]

## Decisions
### Decision 1: [Name]
**Choice**: [Final choice]
**Rationale**: [Why]

## Numerical Framework
### Core Formulas
\`[Formula content]\`

### Balance Parameters
| Parameter | Initial Value | Range | Description |
|-----------|---------------|-------|-------------|

## Risks / Trade-offs
| Risk | Impact | Mitigation |
|------|--------|------------|
\`\`\`

## Spec Format Requirements

### Scenario Formatting (Critical)

**CORRECT** (use #### headers):
\`\`\`markdown
#### Scenario: Player login success
- **GIVEN** Player is registered
- **WHEN** Enter correct username and password
- **THEN** Enter game main interface
\`\`\`

**WRONG**:
\`\`\`markdown
- **Scenario: Player login**  ❌
**Scenario**: Player login     ❌
### Scenario: Player login      ❌
\`\`\`

### Requirement Wording
- Use SHALL/MUST for normative requirements
- Avoid should/may (unless intentionally non-normative)

### Delta Operations
- \`## ADDED Requirements\` - New capabilities
- \`## MODIFIED Requirements\` - Behavior changes (must include complete content)
- \`## REMOVED Requirements\` - Deprecated features (need reason and migration plan)
- \`## RENAMED Requirements\` - Name changes only

## CLI Commands

\`\`\`bash
# Basic commands
ogd list                  # List active changes
ogd list --specs          # List specs
ogd show [item]           # Show details
ogd validate [item]       # Validate change or spec
ogd archive <change-id>   # Archive completed change

# Project management
ogd init [path]           # Initialize OGD
ogd update [path]         # Update instruction files

# Debugging
ogd show [change] --json --deltas-only
ogd validate [change] --strict --no-interactive
\`\`\`

### Command Flags
- \`--json\` - Machine-readable output
- \`--type change|spec\` - Specify type
- \`--strict\` - Strict validation
- \`--no-interactive\` - Disable prompts
- \`--yes\`/\`-y\` - Skip confirmation prompts

## Before Starting Any Task

**Context Checklist**:
- [ ] Read \`ogd/pillars.md\` to understand design pillars
- [ ] Run \`ogd list --specs\` to view existing specs
- [ ] Check pending changes in \`changes/\`
- [ ] Confirm dependent specs are complete

**Before Creating Specs**:
- Always check if capability already exists
- Prefer modifying existing specs over creating duplicates
- Use \`ogd show [spec]\` to review current state
- If ambiguous, ask 1-2 clarifying questions first

## Best Practices

### Experience First
- Describe what players do, what they feel
- Avoid technical implementation details (no engines, languages, databases)
- Focus on design intent, not development approach

### Pillar Alignment
- Verify every feature aligns with pillars
- When conflicts arise, revisit the design or pillars
- Run \`ogd validate\` to check alignment

### Capability Naming
- Use kebab-case: \`combat-system\`, \`equipment-enhance\`
- Single responsibility, one concern per capability
- 10-minute understandability rule
- If description needs "and", consider splitting

### Change ID Naming
- Use verb-led prefixes: \`add-\`, \`update-\`, \`remove-\`
- Short and descriptive: \`add-combat-system\`
- Ensure uniqueness

## Common Issues

### "Change must have at least one delta"
- Check if \`changes/[name]/specs/\` has .md files
- Verify files have operation prefixes (## ADDED Requirements)

### "Requirement must have at least one scenario"
- Check scenarios use \`#### Scenario:\` format (4 hashtags)
- Don't use bullet points or bold as scenario headers

### Silent scenario parsing failures
- Must use exact format: \`#### Scenario: Name\`
- Debug with \`ogd show [change] --json --deltas-only\`

## Quick Reference

### Stage Indicators
- \`changes/\` - Proposal stage, not yet finalized
- \`specs/\` - Finalized, current design truth
- \`archive/\` - Archived changes

### File Purposes
- \`pillars.md\` - Design pillars
- \`proposal.md\` - Why the change
- \`tasks.md\` - Design tasks
- \`design.md\` - Design decisions
- \`spec.md\` - Requirements and behavior

### CLI Essentials
\`\`\`bash
ogd list                  # Changes in progress
ogd list --specs          # Existing specs
ogd show [item]           # View details
ogd validate --strict     # Verify correctness
ogd archive <id> --yes    # Mark complete
\`\`\`

Remember: Specs are truth. Changes are proposals. Keep them in sync.
`;
