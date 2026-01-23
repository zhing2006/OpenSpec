export interface ToolConfigurator {
  name: string;
  configFileName: string;
  isAvailable: boolean;
  configure(projectPath: string, ogdDir: string): Promise<void>;
}