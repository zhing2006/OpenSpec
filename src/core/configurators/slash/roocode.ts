import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const NEW_FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.roo/commands/ogd-proposal.md',
  apply: '.roo/commands/ogd-apply.md',
  archive: '.roo/commands/ogd-archive.md'
};

export class RooCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'roocode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return NEW_FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const descriptions: Record<SlashCommandId, string> = {
      proposal: 'Scaffold a new ogd change and validate strictly.',
      apply: 'Implement an approved ogd change and keep tasks in sync.',
      archive: 'Archive a deployed ogd change and update specs.'
    };
    const description = descriptions[id];
    return `# OGD: ${id.charAt(0).toUpperCase() + id.slice(1)}\n\n${description}`;
  }
}
