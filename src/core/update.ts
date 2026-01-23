import path from 'path';
import { FileSystemUtils } from '../utils/file-system.js';
import { OGD_DIR_NAME } from './config.js';
import { ToolRegistry } from './configurators/registry.js';
import { SlashCommandRegistry } from './configurators/slash/registry.js';
import { agentsTemplate } from './templates/agents-template.js';

export class UpdateCommand {
  async execute(projectPath: string): Promise<void> {
    const resolvedProjectPath = path.resolve(projectPath);
    const ogdDirName = OGD_DIR_NAME;
    const ogdPath = path.join(resolvedProjectPath, ogdDirName);

    // 1. Check gd directory exists
    if (!await FileSystemUtils.directoryExists(ogdPath)) {
      throw new Error(`未找到 OGD 目录。请先运行 'ogd init'。`);
    }

    // 2. Update AGENTS.md (full replacement)
    const agentsPath = path.join(ogdPath, 'AGENTS.md');

    await FileSystemUtils.writeFile(agentsPath, agentsTemplate);

    // 3. Update existing AI tool configuration files only
    const configurators = ToolRegistry.getAll();
    const slashConfigurators = SlashCommandRegistry.getAll();
    const updatedFiles: string[] = [];
    const createdFiles: string[] = [];
    const failedFiles: string[] = [];
    const updatedSlashFiles: string[] = [];
    const failedSlashTools: string[] = [];

    for (const configurator of configurators) {
      const configFilePath = path.join(
        resolvedProjectPath,
        configurator.configFileName
      );
      const fileExists = await FileSystemUtils.fileExists(configFilePath);
      const shouldConfigure =
        fileExists || configurator.configFileName === 'AGENTS.md';

      if (!shouldConfigure) {
        continue;
      }

      try {
        if (fileExists && !await FileSystemUtils.canWriteFile(configFilePath)) {
          throw new Error(
            `没有权限修改 ${configurator.configFileName}`
          );
        }

        await configurator.configure(resolvedProjectPath, ogdPath);
        updatedFiles.push(configurator.configFileName);

        if (!fileExists) {
          createdFiles.push(configurator.configFileName);
        }
      } catch (error) {
        failedFiles.push(configurator.configFileName);
        console.error(
          `更新 ${configurator.configFileName} 失败: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    for (const slashConfigurator of slashConfigurators) {
      if (!slashConfigurator.isAvailable) {
        continue;
      }

      try {
        const updated = await slashConfigurator.updateExisting(
          resolvedProjectPath,
          ogdPath
        );
        updatedSlashFiles.push(...updated);
      } catch (error) {
        failedSlashTools.push(slashConfigurator.toolId);
        console.error(
          `更新 ${slashConfigurator.toolId} 的斜杠命令失败: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    const summaryParts: string[] = [];
    const instructionFiles: string[] = ['ogd/AGENTS.md'];

    if (updatedFiles.includes('AGENTS.md')) {
      instructionFiles.push(
        createdFiles.includes('AGENTS.md') ? 'AGENTS.md (已创建)' : 'AGENTS.md'
      );
    }

    summaryParts.push(
      `已更新 OGD 指令 (${instructionFiles.join(', ')})`
    );

    const aiToolFiles = updatedFiles.filter((file) => file !== 'AGENTS.md');
    if (aiToolFiles.length > 0) {
      summaryParts.push(`已更新 AI 工具文件: ${aiToolFiles.join(', ')}`);
    }

    if (updatedSlashFiles.length > 0) {
      // Normalize to forward slashes for cross-platform log consistency
      const normalized = updatedSlashFiles.map((p) => FileSystemUtils.toPosixPath(p));
      summaryParts.push(`已更新斜杠命令: ${normalized.join(', ')}`);
    }

    const failedItems = [
      ...failedFiles,
      ...failedSlashTools.map(
        (toolId) => `斜杠命令刷新 (${toolId})`
      ),
    ];

    if (failedItems.length > 0) {
      summaryParts.push(`更新失败: ${failedItems.join(', ')}`);
    }

    console.log(summaryParts.join(' | '));

    // No additional notes
  }
}
