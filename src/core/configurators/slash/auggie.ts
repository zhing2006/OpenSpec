import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.augment/commands/ogd-proposal.md',
  apply: '.augment/commands/ogd-apply.md',
  archive: '.augment/commands/ogd-archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new ogd change and validate strictly.
argument-hint: feature description or request
---`,
  apply: `---
description: Implement an approved ogd change and keep tasks in sync.
argument-hint: change-id
---`,
  archive: `---
description: Archive a deployed ogd change and update specs.
argument-hint: change-id
---`
};

export class AuggieSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'auggie';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}

