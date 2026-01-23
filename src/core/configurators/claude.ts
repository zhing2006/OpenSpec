import path from 'path';
import { ToolConfigurator } from './base.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { TemplateManager } from '../templates/index.js';
import { OGD_MARKERS } from '../config.js';

export class ClaudeConfigurator implements ToolConfigurator {
  name = 'Claude Code';
  configFileName = 'CLAUDE.md';
  isAvailable = true;

  async configure(projectPath: string, ogdDir: string): Promise<void> {
    const filePath = path.join(projectPath, this.configFileName);
    const content = TemplateManager.getClaudeTemplate();

    await FileSystemUtils.updateFileWithMarkers(
      filePath,
      content,
      OGD_MARKERS.start,
      OGD_MARKERS.end
    );
  }
}