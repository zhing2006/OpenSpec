import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.iflow/commands/ogd-proposal.md',
  apply: '.iflow/commands/ogd-apply.md',
  archive: '.iflow/commands/ogd-archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: /ogd-proposal
id: ogd-proposal
category: OGD
description: Scaffold a new ogd change and validate strictly.
---`,
  apply: `---
name: /ogd-apply
id: ogd-apply
category: OGD
description: Implement an approved ogd change and keep tasks in sync.
---`,
  archive: `---
name: /ogd-archive
id: ogd-archive
category: OGD
description: Archive a deployed ogd change and update specs.
---`
};

export class IflowSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'iflow';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
