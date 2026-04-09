## Context

OpenSpec currently uses a flat directory structure for `openspec/specs/`, where `getSpecIds()` scans only one level and returns leaf directory names. Delta specs within changes also use flat `specs/<capability>/spec.md` layout.

As projects grow, nested directory support (e.g., `Client/Combat/combat-system/`) is needed to organize specs by functional modules. The delta spec structure within changes must also mirror the target path to support identically-named specs under different categories.

Key files involved:
- `src/utils/item-discovery.ts` — `getSpecIds()`
- `src/core/specs-apply.ts` — `findSpecUpdates()`, `writeUpdatedSpec()`
- `src/core/validation/validator.ts` — `validateChangeDeltaSpecs()`, `extractNameFromPath()`
- `src/core/archive.ts` — pre-validation delta detection, confirmation display
- `src/core/parsers/change-parser.ts` — `ChangeParser.parseDeltaSpecs()`
- `src/core/list.ts` — `list --specs` scan
- `src/core/view.ts` — dashboard spec discovery
- `src/commands/show.ts`, `validate.ts`, `spec.ts` — spec matching and path construction
- `src/core/completions/completion-provider.ts` — shell completions
- `src/core/templates/workflows/sync-specs.ts`, `archive-change.ts` — skill instructions

## Goals / Non-Goals

**Goals:**
- `getSpecIds()` recursively scans and returns full relative paths
- `findSpecUpdates()` recursively scans change's `specs/` directory; relative path maps directly to target
- `validateChangeDeltaSpecs()` recursively discovers delta spec files
- CLI commands support both leaf-name and full-path matching
- sync-specs / archive skill instructions adapt to nested paths
- All path operations use `path.join()` for cross-platform compatibility
- Backward compatible: flat structure remains valid
- Update external `ue-spec-driven` schema templates

**Non-Goals:**
- No changes to spec file format itself (frontmatter, content structure)
- No mandatory nesting requirement (users can continue using flat structure)
- No new CLI commands or subcommands
- No changes to change directory scanning logic (change directories remain flat)

## Decisions

### Decision 1: `getSpecIds()` recursive scan returning full relative paths

**Choice**: Use `fs.readdir` to recursively traverse `openspec/specs/`, collecting all directories containing `spec.md`, returning paths relative to `openspec/specs/`.

**Alternative**: Return leaf names + separate path mapping → increases complexity and cannot handle identically-named specs.

**Implementation**:
```typescript
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
        // not a spec dir, continue scanning deeper
      }
      // always scan children regardless of whether this dir has spec.md
      await scan(path.join(dir, entry.name), relPath);
    }
  }

  await scan(specsPath, '');
  return result.sort();
}
```

**Key behavior**: Even if a directory itself contains `spec.md`, its children are still scanned. This allows intermediate directories to contain specs (though not typical, it should not block scanning).

**Return value path separator**: Uses forward slash `/` (POSIX style), consistent with current single-segment paths. `path.join()` is used when accessing the file system. This ensures cross-platform consistency since return values are primarily used for display and matching.

### Decision 2: Delta spec directory structure mirrors target path

**Choice**: The delta spec directory structure within a change directly reflects the target path. `specs/Client/Combat/combat-system/spec.md` → target is `openspec/specs/Client/Combat/combat-system/spec.md`.

**Alternative A**: Add `specPaths` mapping to `.openspec.yaml` → identically-named specs can't coexist (key collision).
**Alternative B**: Add `specPath` to delta spec frontmatter → invades spec format, requires parser changes.

**Advantage**: Path IS the metadata; zero indirection; naturally supports identically-named specs under different categories.

### Decision 3: `findSpecUpdates()` recursive scan

**Choice**: Recursively scan the change's `specs/` directory to find all `spec.md` files. Each `spec.md`'s target path is determined by its path relative to `specs/`.

**Implementation**:
```typescript
export async function findSpecUpdates(changeDir: string, mainSpecsDir: string): Promise<SpecUpdate[]> {
  const updates: SpecUpdate[] = [];
  const changeSpecsDir = path.join(changeDir, 'specs');

  async function scan(dir: string, prefix: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const relPath = prefix ? path.join(prefix, entry.name) : entry.name;
      const specFile = path.join(dir, entry.name, 'spec.md');
      const targetFile = path.join(mainSpecsDir, relPath, 'spec.md');
      try {
        await fs.access(specFile);
        let exists = false;
        try {
          await fs.access(targetFile);
          exists = true;
        } catch {
          exists = false;
        }
        updates.push({ source: specFile, target: targetFile, exists });
      } catch {
        // no spec.md here, scan deeper
      }
      await scan(path.join(dir, entry.name), relPath);
    }
  }

  await scan(changeSpecsDir, '');
  return updates;
}
```

### Decision 4: Spec matching — leaf name + full path

**Choice**: In `show.ts`, `validate.ts`, and other commands, spec matching supports two modes:
1. Exact full-path match (e.g., `Client/Combat/combat-system`)
2. Leaf-name match (e.g., `combat-system`, matching entries ending with `/<name>`)

**Ambiguity handling**: When a leaf name matches multiple entries, report an error listing all matching full paths.

**Implementation**: Extract a shared matching function:
```typescript
function findSpecMatches(specs: string[], itemName: string): string[] {
  // exact full-path match
  if (specs.includes(itemName)) return [itemName];
  // leaf-name match
  const matches = specs.filter(s => {
    const leaf = s.split('/').pop();
    return leaf === itemName;
  });
  return matches;
}
```

### Decision 5: `validateChangeDeltaSpecs()` recursive discovery

**Choice**: Recursively scan `changeDir/specs/` to find all `spec.md` files. The `entryPath` in issue reports uses the relative path (e.g., `Client/Combat/combat-system/spec.md`).

### Decision 6: `extractNameFromPath()` adaptation

**Choice**: Modify to extract spec name from the parent directory of `spec.md` (the leaf directory name), instead of extracting from the first segment after `specs/`.

**Implementation**:
```typescript
private extractNameFromPath(filePath: string): string {
  const normalizedPath = FileSystemUtils.toPosixPath(filePath);
  const parts = normalizedPath.split('/');
  // parent directory of spec.md is the spec name
  const specMdIndex = parts.lastIndexOf('spec.md');
  if (specMdIndex > 0) {
    return parts[specMdIndex - 1];
  }
  // fallback: proposal.md etc., keep original logic
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i] === 'specs' || parts[i] === 'changes') {
      if (i < parts.length - 1) return parts[i + 1];
    }
  }
  const fileName = parts[parts.length - 1] ?? '';
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
}
```

### Decision 7: sync-specs skill instructions update

**Choice**: Modify the skill instruction text in `sync-specs.ts`, changing all `openspec/specs/<capability>/spec.md` references to emphasize recursive scanning and path-mirroring behavior.

Key changes:
- Step 3b: "Read the main spec" changed to look up main spec by the delta spec's relative path
- Step 3d: "Create new main spec" changed to create at the mirrored path, including intermediate directories
- Output displays full nested paths

### Decision 8: Archive pre-validation delta detection

**Problem**: `archive.ts:113-131` has a separate delta detection loop that scans only one level of `specs/<child>/spec.md`. If a change only has nested delta specs, archive skips delta validation entirely.

**Choice**: Replace the one-level detection loop with a recursive helper (can reuse the same recursive pattern from `findSpecUpdates`). The detection just needs to find ANY `spec.md` file under the `specs/` tree with delta headers.

**Implementation**:
```typescript
// Replace the flat scan in archive.ts with recursive detection
async function hasNestedDeltaSpecs(specsDir: string): Promise<boolean> {
  async function scan(dir: string): Promise<boolean> {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch { return false; }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const candidatePath = path.join(dir, entry.name, 'spec.md');
      try {
        const content = await fs.readFile(candidatePath, 'utf-8');
        if (/^##\s+(ADDED|MODIFIED|REMOVED|RENAMED)\s+Requirements/m.test(content)) {
          return true;
        }
      } catch {}
      if (await scan(path.join(dir, entry.name))) return true;
    }
    return false;
  }
  return scan(specsDir);
}
```

### Decision 9: Archive confirmation/output with full paths

**Problem**: Current archive confirmation displays only leaf names (`path.basename(path.dirname(update.target))`) and doesn't distinguish NEW vs EXISTING clearly.

**Choice**: Update the confirmation display in `archive.ts`:
1. Derive the full relative path from `mainSpecsDir` to the target
2. Group specs into NEW (create) and EXISTING (update) sections
3. Show the source path for each spec

The existing confirmation behavior (default Yes, decline skips updates but continues archive) is preserved unchanged.

The `specs-apply.ts` log output in `writeUpdatedSpec()` also needs to use full relative paths instead of leaf names.

### Decision 10: `ChangeParser.parseDeltaSpecs()` recursive scan

**Problem**: `ChangeParser.parseDeltaSpecs()` in `change-parser.ts:55-82` scans only one level. `change show --json --deltas-only` and `change list` depend on it. Validate's "Next steps" recommends this command for debugging — it must see nested deltas.

**Choice**: Rewrite `parseDeltaSpecs()` to recursively scan the `specs/` directory. The `specName` field in each delta should use the full relative path (e.g., `Client/Combat/combat-system`) so that `--deltas-only` output shows the correct target location.

### Decision 11: `list --specs` and `view` dashboard recursive scan

**Problem**: `list.ts:163` and `view.ts:140` both scan only one level of `openspec/specs/`. Nested specs would be invisible in these browsing entry points.

**Choice**: Replace both one-level scans with recursive traversal. Both can call `getSpecIds()` from `item-discovery.ts` (which is already being made recursive) rather than implementing their own scan logic. This ensures consistency across all entry points.

For `list.ts`, the spec id displayed changes from leaf name to full path. For `view.ts`, the dashboard shows full paths in the spec section.

### Decision 12: Windows input path normalization

**Problem**: Design specifies `getSpecIds()` returns POSIX `/` paths and matching uses `split('/')`, but user input on Windows may use backslashes (e.g., `Client\Combat\combat-system`). Without normalization, matching fails.

**Choice**: Normalize user-supplied spec IDs to POSIX style before matching. Add a normalization step in the shared `findSpecMatches()` function:
```typescript
function findSpecMatches(specs: string[], itemName: string): string[] {
  const normalized = itemName.replace(/\\/g, '/');
  if (specs.includes(normalized)) return [normalized];
  const matches = specs.filter(s => {
    const leaf = s.split('/').pop();
    return leaf === normalized;
  });
  return matches;
}
```

This covers both `show.ts` and `validate.ts` since they share the matching function.

### Decision 13: External `ue-spec-driven` schema update

`ue-spec-driven` is located at the project repo's `openspec/schemas/ue-spec-driven/`, not part of OpenSpec core. Companion updates:

- `schema.yaml`: proposal artifact `instruction` — prompt agent to examine spec tree structure first, organize delta specs in nested paths
- `schema.yaml`: specs artifact `instruction` — explain that delta spec directory structure must mirror target paths
- `templates/proposal.md`: add path classification hints to capabilities section

## Risks / Trade-offs

- **[Risk] Path separator inconsistency** → Mitigation: `getSpecIds()` returns POSIX-style paths (`/`); `path.join()` used for file system operations
- **[Risk] Existing tests depend on flat structure** → Mitigation: Update test cases individually; ensure coverage for both flat and nested scenarios
- **[Risk] Recursive scan performance** → Mitigation: Spec directories are small (typically dozens of entries); recursive scan overhead is negligible
- **[Trade-off] Leaf-name matching ambiguity** → Accepted: Report error on ambiguity; user resolves with full path. This maintains backward compatibility
- **[Risk] Intermediate directory name conflicts with spec name** → Mitigation: Scanning logic allows intermediate directories to contain `spec.md`, but this usage is not recommended
