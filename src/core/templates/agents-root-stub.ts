export const agentsRootStubTemplate = `# OGD (OpenGameDesign) Instructions

These instructions are for AI assistants working in this project.

**OGD is for GAME DESIGN tasks** - creating game design documents, not source code.
Use OGD for: game vision, feature specs, gameplay design, numerical frameworks, balance analysis.

Always open \`@/ogd/AGENTS.md\` when the request involves:

- Game design planning or proposals (gameplay, systems, mechanics, balance)
- New game features, worldbuilding, narrative design
- Design specs, design pillars, player experience goals

Use \`@/ogd/AGENTS.md\` to learn:

- How to create and apply change game design proposals
- Game design spec format and conventions
- Game design structure and guidelines

Keep this managed block so 'ogd update' can refresh the instructions.
`;
