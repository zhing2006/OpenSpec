import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { runCLI } from '../helpers/run-cli.js';

describe('top-level validate command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-validate-command-tmp');
  const changesDir = path.join(testDir, 'openspec', 'changes');
  const specsDir = path.join(testDir, 'openspec', 'specs');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });

    // Create a valid spec
    const specContent = [
      '## Purpose',
      'This spec ensures the validation harness exercises a deterministic alpha module for automated tests.',
      '',
      '## Requirements',
      '',
      '### Requirement: Alpha module SHALL produce deterministic output',
      'The alpha module SHALL produce a deterministic response for validation.',
      '',
      '#### Scenario: Deterministic alpha run',
      '- **GIVEN** a configured alpha module',
      '- **WHEN** the module runs the default flow',
      '- **THEN** the output matches the expected fixture result',
    ].join('\n');
    await fs.mkdir(path.join(specsDir, 'alpha'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'alpha', 'spec.md'), specContent, 'utf-8');

    // Create a simple change with bullets (parser supports this)
    const changeContent = `# Test Change\n\n## Why\nBecause reasons that are sufficiently long for validation.\n\n## What Changes\n- **alpha:** Add something`;
    await fs.mkdir(path.join(changesDir, 'c1'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'c1', 'proposal.md'), changeContent, 'utf-8');
    const deltaContent = [
      '## ADDED Requirements',
      '### Requirement: Validator SHALL support alpha change deltas',
      'The validator SHALL accept deltas provided by the test harness.',
      '',
      '#### Scenario: Apply alpha delta',
      '- **GIVEN** the test change delta',
      '- **WHEN** openspec validate runs',
      '- **THEN** the validator reports the change as valid',
    ].join('\n');
    const c1DeltaDir = path.join(changesDir, 'c1', 'specs', 'alpha');
    await fs.mkdir(c1DeltaDir, { recursive: true });
    await fs.writeFile(path.join(c1DeltaDir, 'spec.md'), deltaContent, 'utf-8');

    // Duplicate name for ambiguity test
    await fs.mkdir(path.join(changesDir, 'dup'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'dup', 'proposal.md'), changeContent, 'utf-8');
    const dupDeltaDir = path.join(changesDir, 'dup', 'specs', 'dup');
    await fs.mkdir(dupDeltaDir, { recursive: true });
    await fs.writeFile(path.join(dupDeltaDir, 'spec.md'), deltaContent, 'utf-8');
    await fs.mkdir(path.join(specsDir, 'dup'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'dup', 'spec.md'), specContent, 'utf-8');
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('prints a helpful hint when no args in non-interactive mode', async () => {
    const result = await runCLI(['validate'], { cwd: testDir });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Nothing to validate. Try one of:');
  });

  it('validates all with --all and outputs JSON summary', async () => {
    const result = await runCLI(['validate', '--all', '--json'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
    const output = result.stdout.trim();
    expect(output).not.toBe('');
    const json = JSON.parse(output);
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.summary?.totals?.items).toBeDefined();
    expect(json.version).toBe('1.0');
  });

  it('validates only specs with --specs and respects --concurrency', async () => {
    const result = await runCLI(['validate', '--specs', '--json', '--concurrency', '1'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
    const output = result.stdout.trim();
    expect(output).not.toBe('');
    const json = JSON.parse(output);
    expect(json.items.every((i: any) => i.type === 'spec')).toBe(true);
  });

  it('errors on ambiguous item names and suggests type override', async () => {
    const result = await runCLI(['validate', 'dup'], { cwd: testDir });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Ambiguous item');
  });

  it('validates nested spec by full path', async () => {
    // Create a nested spec
    const nestedSpecDir = path.join(specsDir, 'Client', 'Combat', 'combat-system');
    await fs.mkdir(nestedSpecDir, { recursive: true });
    const specContent = [
      '## Purpose',
      'Combat system specification for automated tests.',
      '',
      '## Requirements',
      '',
      '### Requirement: Combat system SHALL handle damage calculation',
      'The combat system SHALL calculate damage based on attack and defense stats.',
      '',
      '#### Scenario: Basic damage calculation',
      '- **GIVEN** an attacker with known stats',
      '- **WHEN** the attack lands on a target',
      '- **THEN** damage is calculated correctly',
    ].join('\n');
    await fs.writeFile(path.join(nestedSpecDir, 'spec.md'), specContent, 'utf-8');

    const result = await runCLI(['validate', 'Client/Combat/combat-system', '--type', 'spec'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
  });

  it('validates nested spec by unique leaf name', async () => {
    // Create a nested spec with unique leaf name
    const nestedSpecDir = path.join(specsDir, 'Server', 'Core', 'networking');
    await fs.mkdir(nestedSpecDir, { recursive: true });
    const specContent = [
      '## Purpose',
      'Networking specification for automated tests.',
      '',
      '## Requirements',
      '',
      '### Requirement: Network layer SHALL handle connections',
      'The network layer SHALL manage client connections reliably.',
      '',
      '#### Scenario: Client connection',
      '- **GIVEN** a running server',
      '- **WHEN** a client connects',
      '- **THEN** the connection is established',
    ].join('\n');
    await fs.writeFile(path.join(nestedSpecDir, 'spec.md'), specContent, 'utf-8');

    const result = await runCLI(['validate', 'networking', '--type', 'spec'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
  });

  it('validates change with nested delta specs', async () => {
    // Create a change with nested delta specs
    const nestedChangeDir = path.join(changesDir, 'nested-change');
    await fs.mkdir(nestedChangeDir, { recursive: true });
    const changeContent = `# Nested Change\n\n## Why\nBecause we need nested delta spec validation testing.\n\n## What Changes\n- **combat:** Add combat feature`;
    await fs.writeFile(path.join(nestedChangeDir, 'proposal.md'), changeContent, 'utf-8');

    const nestedDeltaDir = path.join(nestedChangeDir, 'specs', 'Client', 'Combat', 'combat-system');
    await fs.mkdir(nestedDeltaDir, { recursive: true });
    const deltaContent = [
      '## ADDED Requirements',
      '### Requirement: Combat system SHALL track player health',
      'The combat system SHALL maintain accurate health tracking.',
      '',
      '#### Scenario: Health tracking',
      '- **GIVEN** a player enters combat',
      '- **WHEN** they take damage',
      '- **THEN** their health is reduced accordingly',
    ].join('\n');
    await fs.writeFile(path.join(nestedDeltaDir, 'spec.md'), deltaContent, 'utf-8');

    const result = await runCLI(['validate', 'nested-change'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
  });

  it('accepts change proposals saved with CRLF line endings', async () => {
    const changeId = 'crlf-change';
    const toCrlf = (segments: string[]) => segments.join('\n').replace(/\n/g, '\r\n');

    const crlfContent = toCrlf([
      '# CRLF Proposal',
      '',
      '## Why',
      'This change verifies validation works with Windows line endings.',
      '',
      '## What Changes',
      '- **alpha:** Ensure validation passes on CRLF files',
    ]);

    await fs.mkdir(path.join(changesDir, changeId), { recursive: true });
    await fs.writeFile(path.join(changesDir, changeId, 'proposal.md'), crlfContent, 'utf-8');

    const deltaContent = toCrlf([
      '## ADDED Requirements',
      '### Requirement: Parser SHALL accept CRLF change proposals',
      'The parser SHALL accept CRLF change proposals without manual edits.',
      '',
      '#### Scenario: Validate CRLF change',
      '- **GIVEN** a change proposal saved with CRLF line endings',
      '- **WHEN** a developer runs openspec validate on the proposal',
      '- **THEN** validation succeeds without section errors',
    ]);

    const deltaDir = path.join(changesDir, changeId, 'specs', 'alpha');
    await fs.mkdir(deltaDir, { recursive: true });
    await fs.writeFile(path.join(deltaDir, 'spec.md'), deltaContent, 'utf-8');

    const result = await runCLI(['validate', changeId], { cwd: testDir });
    expect(result.exitCode).toBe(0);
  });

  it('respects --no-interactive flag passed via CLI', async () => {
    // This test ensures Commander.js --no-interactive flag is correctly parsed
    // and passed to the validate command. The flag sets options.interactive = false
    // (not options.noInteractive = true) due to Commander.js convention.
    const result = await runCLI(['validate', '--specs', '--no-interactive'], {
      cwd: testDir,
      // Don't set OPEN_SPEC_INTERACTIVE to ensure we're testing the flag itself
      env: { ...process.env, OPEN_SPEC_INTERACTIVE: undefined },
    });
    expect(result.exitCode).toBe(0);
    // Should complete without hanging and without prompts
    expect(result.stderr).not.toContain('What would you like to validate?');
  });
});
