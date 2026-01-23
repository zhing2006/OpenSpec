import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.agent/workflows/ogd-proposal.md',
  apply: '.agent/workflows/ogd-apply.md',
  archive: '.agent/workflows/ogd-archive.md'
};

const DESCRIPTIONS: Record<SlashCommandId, string> = {
  proposal: 'Scaffold a new ogd change and validate strictly.',
  apply: 'Implement an approved ogd change and keep tasks in sync.',
  archive: 'Archive a deployed ogd change and update specs.'
};

export class AntigravitySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'antigravity';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const description = DESCRIPTIONS[id];
    return `---\ndescription: ${description}\n---`;
  }
}
