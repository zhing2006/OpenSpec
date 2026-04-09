import { describe, it, expect } from 'vitest';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';
import { ChangeParser } from '../../../src/core/parsers/change-parser.js';

async function withTempDir(run: (dir: string) => Promise<void>) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'openspec-change-parser-'));
  try {
    await run(dir);
  } finally {
    // Best-effort cleanup
    try { await fs.rm(dir, { recursive: true, force: true }); } catch {}
  }
}

describe('ChangeParser', () => {
  it('parses simple What Changes bullet list', async () => {
    const content = `# Test Change\n\n## Why\nWe need it because reasons that are sufficiently long.\n\n## What Changes\n- **spec-a:** Add a new requirement to A\n- **spec-b:** Rename requirement X to Y\n- **spec-c:** Remove obsolete requirement`;

    const parser = new ChangeParser(content, process.cwd());
    const change = await parser.parseChangeWithDeltas('test-change');

    expect(change.name).toBe('test-change');
    expect(change.deltas.length).toBe(3);
    expect(change.deltas[0].spec).toBe('spec-a');
    expect(['ADDED', 'MODIFIED', 'REMOVED', 'RENAMED']).toContain(change.deltas[1].operation);
  });

  it('prefers delta-format specs over simple bullets when both exist', async () => {
    await withTempDir(async (dir) => {
      const changeDir = dir;
      const specsDir = path.join(changeDir, 'specs', 'foo');
      await fs.mkdir(specsDir, { recursive: true });

      const content = `# Test Change\n\n## Why\nWe need it because reasons that are sufficiently long.\n\n## What Changes\n- **foo:** Add something via bullets (should be overridden)`;
      const deltaSpec = `# Delta for Foo\n\n## ADDED Requirements\n\n### Requirement: New thing\n\n#### Scenario: basic\nGiven X\nWhen Y\nThen Z`;

      await fs.writeFile(path.join(specsDir, 'spec.md'), deltaSpec, 'utf8');

      const parser = new ChangeParser(content, changeDir);
      const change = await parser.parseChangeWithDeltas('test-change');

      expect(change.deltas.length).toBeGreaterThan(0);
      // Since delta spec exists, the description should reflect delta-derived entries
      expect(change.deltas[0].spec).toBe('foo');
      expect(change.deltas[0].description).toContain('Add requirement:');
      expect(change.deltas[0].operation).toBe('ADDED');
      expect(change.deltas[0].requirement).toBeDefined();
    });
  });

  it('discovers nested delta specs with full relative paths', async () => {
    await withTempDir(async (dir) => {
      const changeDir = dir;

      // Create nested delta specs
      const nestedSpec1 = path.join(changeDir, 'specs', 'Client', 'Combat', 'combat-system');
      const nestedSpec2 = path.join(changeDir, 'specs', 'Client', 'UI', 'hud-system');
      await fs.mkdir(nestedSpec1, { recursive: true });
      await fs.mkdir(nestedSpec2, { recursive: true });

      const deltaSpec1 = `## ADDED Requirements\n\n### Requirement: Combat Feature\nThe system SHALL provide combat.\n\n#### Scenario: Attack\n- **GIVEN** a player\n- **WHEN** they attack\n- **THEN** damage is dealt`;
      const deltaSpec2 = `## MODIFIED Requirements\n\n### Requirement: HUD Display\nThe system SHALL display HUD.\n\n#### Scenario: Show health\n- **GIVEN** a player\n- **WHEN** they take damage\n- **THEN** health bar updates`;

      await fs.writeFile(path.join(nestedSpec1, 'spec.md'), deltaSpec1, 'utf8');
      await fs.writeFile(path.join(nestedSpec2, 'spec.md'), deltaSpec2, 'utf8');

      const content = `# Test Change\n\n## Why\nNested spec test with sufficient length.\n\n## What Changes\n- **combat-system:** Add combat feature`;

      const parser = new ChangeParser(content, changeDir);
      const change = await parser.parseChangeWithDeltas('nested-test');

      expect(change.deltas.length).toBe(2);
      const specNames = change.deltas.map(d => d.spec);
      expect(specNames).toContain('Client/Combat/combat-system');
      expect(specNames).toContain('Client/UI/hud-system');
    });
  });

  it('discovers deeply nested delta specs', async () => {
    await withTempDir(async (dir) => {
      const changeDir = dir;
      const deepSpec = path.join(changeDir, 'specs', 'Server', 'Core', 'Networking', 'protocol');
      await fs.mkdir(deepSpec, { recursive: true });

      const deltaSpec = `## ADDED Requirements\n\n### Requirement: Protocol\nThe system SHALL implement protocol.\n\n#### Scenario: Connect\n- **GIVEN** a client\n- **WHEN** connecting\n- **THEN** handshake completes`;
      await fs.writeFile(path.join(deepSpec, 'spec.md'), deltaSpec, 'utf8');

      const content = `# Test Change\n\n## Why\nDeep nesting test with sufficient length.\n\n## What Changes\n- **protocol:** Add protocol`;

      const parser = new ChangeParser(content, changeDir);
      const change = await parser.parseChangeWithDeltas('deep-test');

      expect(change.deltas.length).toBe(1);
      expect(change.deltas[0].spec).toBe('Server/Core/Networking/protocol');
    });
  });

  it('discovers both flat and nested delta specs together', async () => {
    await withTempDir(async (dir) => {
      const changeDir = dir;

      // Flat delta spec
      const flatSpec = path.join(changeDir, 'specs', 'auth');
      await fs.mkdir(flatSpec, { recursive: true });
      const flatDelta = `## ADDED Requirements\n\n### Requirement: Auth\nThe system SHALL authenticate.\n\n#### Scenario: Login\n- **GIVEN** credentials\n- **WHEN** login\n- **THEN** authenticated`;
      await fs.writeFile(path.join(flatSpec, 'spec.md'), flatDelta, 'utf8');

      // Nested delta spec
      const nestedSpec = path.join(changeDir, 'specs', 'Client', 'Combat', 'damage');
      await fs.mkdir(nestedSpec, { recursive: true });
      const nestedDelta = `## ADDED Requirements\n\n### Requirement: Damage\nThe system SHALL calculate damage.\n\n#### Scenario: Hit\n- **GIVEN** attack\n- **WHEN** hit\n- **THEN** damage applied`;
      await fs.writeFile(path.join(nestedSpec, 'spec.md'), nestedDelta, 'utf8');

      const content = `# Test Change\n\n## Why\nMixed flat and nested test with enough words.\n\n## What Changes\n- **auth:** Add auth`;

      const parser = new ChangeParser(content, changeDir);
      const change = await parser.parseChangeWithDeltas('mixed-test');

      expect(change.deltas.length).toBe(2);
      const specNames = change.deltas.map(d => d.spec);
      expect(specNames).toContain('auth');
      expect(specNames).toContain('Client/Combat/damage');
    });
  });
});
