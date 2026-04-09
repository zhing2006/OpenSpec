## Why

Currently `openspec/specs/` uses a flat directory structure where all specs live at the same level. As the project grows, organizing specs by functional modules becomes necessary. Nested directory support (e.g., `Client/Combat/combat-system/spec.md`) enables hierarchical categorization. Additionally, the delta spec directory structure within a change needs to mirror the target path, allowing identically-named specs to coexist under different categories.

## What Changes

- `getSpecIds()` recursively scans `openspec/specs/` and returns full relative paths (e.g., `Client/Combat/combat-system`) instead of just leaf directory names
- `findSpecUpdates()` recursively scans the change's `specs/` directory; the delta spec's relative path directly maps to the target path
- `validateChangeDeltaSpecs()` recursively discovers delta spec files instead of scanning only the first directory level
- `extractNameFromPath()` correctly extracts the spec name from nested paths
- `show` and `validate` commands support both leaf-name and full-path spec matching
- `spec list` recursively scans and returns full paths
- `spec show`/`spec validate` support leaf-name resolution with ambiguity handling
- `archive` pre-validation delta detection uses recursive scanning
- `archive` confirmation/output displays full nested paths, distinguishes NEW/EXISTING
- `ChangeParser.parseDeltaSpecs()` recursively discovers nested delta specs (fixes `change show --json --deltas-only`)
- `list --specs` and `view` dashboard recursively discover specs
- sync-specs skill instructions updated to guide the agent to read/write main specs at nested paths
- archive-change skill instructions updated for nested path references in the sync step
- Windows input path normalization before matching (backslash → forward-slash)
- All related test cases updated accordingly

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `cli-spec`: `getSpecIds()` returns full paths via recursive scan; `spec list` recursive; `spec show`/`spec validate` support leaf-name resolution with ambiguity handling
- `cli-validate`: `validateChangeDeltaSpecs()` recursively discovers delta specs; `extractNameFromPath()` adapts to nested paths; spec matching supports both leaf names and full paths
- `cli-show`: spec matching changes from `includes()` to support both leaf-name and full-path matching
- `cli-archive`: `findSpecUpdates()` and `writeUpdatedSpec()` adapt to nested paths; pre-validation delta detection recursive; confirmation display uses full paths with NEW/EXISTING grouping
- `cli-change`: `ChangeParser.parseDeltaSpecs()` recursively discovers nested delta specs for `change show --json --deltas-only`
- `cli-list`: `list --specs` recursively scans and displays full paths
- `cli-view`: dashboard spec discovery recursively scans nested directories
- `specs-sync-skill`: skill instructions updated to guide the agent to operate on main specs at nested paths
- `cli-completion`: `getSpecIds()` return format changes; shell completion candidates use full nested paths

## Impact

- **Core modules**: `src/utils/item-discovery.ts`, `src/core/specs-apply.ts`, `src/core/validation/validator.ts`, `src/core/archive.ts`, `src/core/parsers/change-parser.ts`, `src/core/list.ts`, `src/core/view.ts`
- **Command layer**: `src/commands/show.ts`, `src/commands/validate.ts`, `src/commands/spec.ts`
- **Skill templates**: `src/core/templates/workflows/sync-specs.ts`, `src/core/templates/workflows/archive-change.ts`
- **Completion system**: `src/core/completions/completion-provider.ts`
- **Tests**: Related test files under `test/` must be updated
- **External schema**: The project's `ue-spec-driven` schema proposal/specs instructions and templates need companion updates (outside this repo but handled as part of this change)
- **Backward compatibility**: Flat structure remains valid (nesting depth of 0 behaves the same); this is NOT a BREAKING change
