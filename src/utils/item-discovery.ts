import { promises as fs } from 'fs';
import path from 'path';

export async function getActiveChangeIds(root: string = process.cwd()): Promise<string[]> {
  const changesPath = path.join(root, 'openspec', 'changes');
  try {
    const entries = await fs.readdir(changesPath, { withFileTypes: true });
    const result: string[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'archive') continue;
      const proposalPath = path.join(changesPath, entry.name, 'proposal.md');
      try {
        await fs.access(proposalPath);
        result.push(entry.name);
      } catch {
        // skip directories without proposal.md
      }
    }
    return result.sort();
  } catch {
    return [];
  }
}

export async function getSpecIds(root: string = process.cwd()): Promise<string[]> {
  const specsPath = path.join(root, 'openspec', 'specs');
  const result: string[] = [];

  async function scan(dir: string, prefix: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const specFile = path.join(dir, entry.name, 'spec.md');
      try {
        await fs.access(specFile);
        result.push(relPath);
      } catch {
        // not a spec dir at this level
      }
      await scan(path.join(dir, entry.name), relPath);
    }
  }

  await scan(specsPath, '');
  return result.sort();
}

/**
 * Find spec matches by full path or leaf name.
 * Normalizes Windows backslashes before matching.
 * Returns matching full paths from the specs array.
 */
export function findSpecMatches(specs: string[], itemName: string): string[] {
  const normalized = itemName.replace(/\\/g, '/');
  // Exact full-path match
  if (specs.includes(normalized)) return [normalized];
  // Leaf-name match
  const matches = specs.filter(s => {
    const leaf = s.split('/').pop();
    return leaf === normalized;
  });
  return matches;
}

export async function getArchivedChangeIds(root: string = process.cwd()): Promise<string[]> {
  const archivePath = path.join(root, 'openspec', 'changes', 'archive');
  try {
    const entries = await fs.readdir(archivePath, { withFileTypes: true });
    const result: string[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const proposalPath = path.join(archivePath, entry.name, 'proposal.md');
      try {
        await fs.access(proposalPath);
        result.push(entry.name);
      } catch {
        // skip directories without proposal.md
      }
    }
    return result.sort();
  } catch {
    return [];
  }
}

