import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.codebuddy/commands/ogd/proposal.md',
  apply: '.codebuddy/commands/ogd/apply.md',
  archive: '.codebuddy/commands/ogd/archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: OGD: Proposal
description: "Scaffold a new ogd change and validate strictly."
argument-hint: "[feature description or request]"
---`,
  apply: `---
name: OGD: Apply
description: "Implement an approved ogd change and keep tasks in sync."
argument-hint: "[change-id]"
---`,
  archive: `---
name: OGD: Archive
description: "Archive a deployed ogd change and update specs."
argument-hint: "[change-id]"
---`
};

export class CodeBuddySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'codebuddy';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}

