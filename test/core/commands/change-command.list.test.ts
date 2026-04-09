import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChangeCommand } from '../../../src/commands/change.js';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

describe('ChangeCommand.list', () => {
  let cmd: ChangeCommand;
  let tempRoot: string;
  let originalCwd: string;

  beforeAll(async () => {
    cmd = new ChangeCommand();
    originalCwd = process.cwd();
    tempRoot = path.join(os.tmpdir(), `openspec-change-command-list-${Date.now()}`);
    const changeDir = path.join(tempRoot, 'openspec', 'changes', 'demo');
    await fs.mkdir(changeDir, { recursive: true });
    const proposal = `# Change: Demo\n\n## Why\nTest list.\n\n## What Changes\n- **auth:** Add requirement`;
    await fs.writeFile(path.join(changeDir, 'proposal.md'), proposal, 'utf-8');
    await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [x] Task 1\n- [ ] Task 2\n', 'utf-8');
    process.chdir(tempRoot);
  });

  afterAll(async () => {
    process.chdir(originalCwd);
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it('returns JSON with expected shape', async () => {
    // Capture console output
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.list({ json: true });

      const output = logs.join('\n');
      const parsed = JSON.parse(output);
      expect(Array.isArray(parsed)).toBe(true);
      if (parsed.length > 0) {
        const item = parsed[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('deltaCount');
        expect(item).toHaveProperty('taskStatus');
        expect(item.taskStatus).toHaveProperty('total');
        expect(item.taskStatus).toHaveProperty('completed');
      }
    } finally {
      console.log = origLog;
    }
  });

  it('prints IDs by default and details with --long', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };
      await cmd.list({});
      const idsOnly = logs.join('\n');
      expect(idsOnly).toMatch(/\w+/);
      logs.length = 0;
      await cmd.list({ long: true });
      const longOut = logs.join('\n');
      expect(longOut).toMatch(/:\s/);
      expect(longOut).toMatch(/\[deltas\s\d+\]/);
    } finally {
      console.log = origLog;
    }
  });

  it('counts nested delta specs correctly in JSON output', async () => {
    const nestedChangeDir = path.join(tempRoot, 'openspec', 'changes', 'nested-demo');
    await fs.mkdir(nestedChangeDir, { recursive: true });

    const proposal = `# Change: Nested Demo\n\n## Why\nTest nested deltas.\n\n## What Changes\n- **combat-system:** Add requirement`;
    await fs.writeFile(path.join(nestedChangeDir, 'proposal.md'), proposal, 'utf-8');

    const deltaContent = `## ADDED Requirements\n\n### Requirement: Test\nThe system SHALL test.\n\n#### Scenario: Basic\n- **GIVEN** X\n- **WHEN** Y\n- **THEN** Z`;
    const nestedSpec1 = path.join(nestedChangeDir, 'specs', 'Client', 'Combat', 'combat-system');
    const nestedSpec2 = path.join(nestedChangeDir, 'specs', 'Client', 'UI', 'hud-system');
    await fs.mkdir(nestedSpec1, { recursive: true });
    await fs.mkdir(nestedSpec2, { recursive: true });
    await fs.writeFile(path.join(nestedSpec1, 'spec.md'), deltaContent, 'utf-8');
    await fs.writeFile(path.join(nestedSpec2, 'spec.md'), deltaContent, 'utf-8');

    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.list({ json: true });

      const output = logs.join('\n');
      const parsed = JSON.parse(output);
      const nestedItem = parsed.find((item: any) => item.id === 'nested-demo');
      expect(nestedItem).toBeDefined();
      expect(nestedItem.deltaCount).toBe(2);
    } finally {
      console.log = origLog;
    }
  });

  it('shows nested delta count in --long output', async () => {
    const nestedChangeDir = path.join(tempRoot, 'openspec', 'changes', 'deep-nested');
    await fs.mkdir(nestedChangeDir, { recursive: true });

    const proposal = `# Change: Deep Nested\n\n## Why\nTest deep nesting.\n\n## What Changes\n- **system:** Update`;
    await fs.writeFile(path.join(nestedChangeDir, 'proposal.md'), proposal, 'utf-8');

    const deltaContent = `## ADDED Requirements\n\n### Requirement: Deep\nThe system SHALL go deep.\n\n#### Scenario: Deep\n- **GIVEN** A\n- **WHEN** B\n- **THEN** C`;
    const deepSpec = path.join(nestedChangeDir, 'specs', 'Server', 'Core', 'Networking', 'protocol');
    await fs.mkdir(deepSpec, { recursive: true });
    await fs.writeFile(path.join(deepSpec, 'spec.md'), deltaContent, 'utf-8');

    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.list({ long: true });

      const longOut = logs.join('\n');
      expect(longOut).toMatch(/deep-nested.*\[deltas\s1\]/);
    } finally {
      console.log = origLog;
    }
  });
});
