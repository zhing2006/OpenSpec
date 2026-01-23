import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.windsurf/workflows/ogd-proposal.md',
  apply: '.windsurf/workflows/ogd-apply.md',
  archive: '.windsurf/workflows/ogd-archive.md'
};

export class WindsurfSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'windsurf';
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
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
