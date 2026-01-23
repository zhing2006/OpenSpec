import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.continue/prompts/ogd-proposal.prompt',
  apply: '.continue/prompts/ogd-apply.prompt',
  archive: '.continue/prompts/ogd-archive.prompt'
};

/*
 * Continue .prompt format requires YAML frontmatter:
 * ---
 * name: commandName
 * description: description
 * invokable: true
 * ---
 * Body...
 *
 * The 'invokable: true' field is required to make the prompt available as a slash command.
 * We use 'ogd-proposal' as the name so the command becomes /ogd-proposal.
 */
const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: ogd-proposal
description: Scaffold a new ogd change and validate strictly.
invokable: true
---`,
  apply: `---
name: ogd-apply
description: Implement an approved ogd change and keep tasks in sync.
invokable: true
---`,
  archive: `---
name: ogd-archive
description: Archive a deployed ogd change and update specs.
invokable: true
---`
};

export class ContinueSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'continue';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
