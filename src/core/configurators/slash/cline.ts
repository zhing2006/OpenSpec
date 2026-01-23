import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.clinerules/workflows/ogd-proposal.md',
  apply: '.clinerules/workflows/ogd-apply.md',
  archive: '.clinerules/workflows/ogd-archive.md'
};

export class ClineSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'cline';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
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
