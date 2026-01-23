import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.github/prompts/ogd-proposal.prompt.md',
  apply: '.github/prompts/ogd-apply.prompt.md',
  archive: '.github/prompts/ogd-archive.prompt.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new ogd change and validate strictly.
---

$ARGUMENTS`,
  apply: `---
description: Implement an approved ogd change and keep tasks in sync.
---

$ARGUMENTS`,
  archive: `---
description: Archive a deployed ogd change and update specs.
---

$ARGUMENTS`
};

export class GitHubCopilotSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'github-copilot';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
