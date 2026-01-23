import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.crush/commands/ogd/proposal.md',
  apply: '.crush/commands/ogd/apply.md',
  archive: '.crush/commands/ogd/archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: OGD: Proposal
description: Scaffold a new ogd change and validate strictly.
category: OGD
tags: [ogd, change]
---`,
  apply: `---
name: OGD: Apply
description: Implement an approved ogd change and keep tasks in sync.
category: OGD
tags: [ogd, apply]
---`,
  archive: `---
name: OGD: Archive
description: Archive a deployed ogd change and update specs.
category: OGD
tags: [ogd, archive]
---`
};

export class CrushSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'crush';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}