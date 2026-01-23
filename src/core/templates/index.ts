import { agentsTemplate } from './agents-template.js';
import { pillarsTemplate, PillarsContext } from './pillars-template.js';
import { claudeTemplate } from './claude-template.js';
import { clineTemplate } from './cline-template.js';
import { costrictTemplate } from './costrict-template.js';
import { agentsRootStubTemplate } from './agents-root-stub.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';

export interface Template {
  path: string;
  content: string | ((context: PillarsContext) => string);
}

export class TemplateManager {
  static getTemplates(context: PillarsContext = {}): Template[] {
    return [
      {
        path: 'AGENTS.md',
        content: agentsTemplate
      },
      {
        path: 'pillars.md',
        content: pillarsTemplate(context)
      }
    ];
  }

  static getClaudeTemplate(): string {
    return claudeTemplate;
  }

  static getClineTemplate(): string {
    return clineTemplate;
  }

  static getCostrictTemplate(): string {
    return costrictTemplate;
  }

  static getAgentsStandardTemplate(): string {
    return agentsRootStubTemplate;
  }

  static getSlashCommandBody(id: SlashCommandId): string {
    return getSlashCommandBody(id);
  }
}

export { PillarsContext } from './pillars-template.js';
export type { SlashCommandId } from './slash-command-templates.js';
