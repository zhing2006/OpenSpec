import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.claude/commands/ogd/proposal.md',
  apply: '.claude/commands/ogd/apply.md',
  archive: '.claude/commands/ogd/archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: OGD - Proposal
description: Scaffold a new ogd change and validate strictly.
category: OGD
tags: [ogd, change]
---`,
  apply: `---
name: OGD - Apply
description: Implement an approved ogd change and keep tasks in sync.
category: OGD
tags: [ogd, apply]
---`,
  archive: `---
name: OGD - Archive
description: Archive a deployed ogd change and update specs.
category: OGD
tags: [ogd, archive]
---`
};

export class ClaudeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'claude';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
