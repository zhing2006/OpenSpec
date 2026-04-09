## 1. Core: `getSpecIds()` recursive scan

- [x] 1.1 Rewrite `getSpecIds()` in `src/utils/item-discovery.ts` to recursively scan `openspec/specs/` and return full relative paths using forward-slash separator
- [x] 1.2 Update `test/core/completions/completion-provider.test.ts` — `getSpecIds` tests to cover nested directory structures and verify full-path return values
- [x] 1.3 Run tests to verify backward compatibility with flat structure

## 2. Core: `findSpecUpdates()` recursive scan

- [x] 2.1 Rewrite `findSpecUpdates()` in `src/core/specs-apply.ts` to recursively scan the change's `specs/` directory; derive target path from relative directory structure
- [x] 2.2 Ensure `writeUpdatedSpec()` creates intermediate directories (`fs.mkdir` with `recursive: true`) for nested target paths
- [x] 2.3 Update `writeUpdatedSpec()` log output to use full relative path instead of leaf name
- [x] 2.4 Update `test/core/archive.test.ts` — add test cases for nested delta spec discovery and target path derivation

## 3. Core: Validation

- [x] 3.1 Rewrite `validateChangeDeltaSpecs()` in `src/core/validation/validator.ts` to recursively discover delta spec files in nested directories
- [x] 3.2 Update `entryPath` in issue reports to use the full relative path (e.g., `Client/Combat/combat-system/spec.md`)
- [x] 3.3 Fix `extractNameFromPath()` in `src/core/validation/validator.ts` to extract spec name from the parent directory of `spec.md` instead of the first segment after `specs/`
- [x] 3.4 Update `test/core/validation.test.ts` — add test cases for nested delta spec validation and `extractNameFromPath()` with nested paths

## 4. Core: Archive pre-validation and confirmation

- [x] 4.1 Rewrite the delta spec detection loop in `src/core/archive.ts` (lines ~113-131) to recursively scan the change's `specs/` directory for delta-formatted `spec.md` files
- [x] 4.2 Update the confirmation display in `src/core/archive.ts` (lines ~203-209) to show full relative paths, group into NEW/EXISTING sections, and include source paths
- [x] 4.3 Update `test/core/archive.test.ts` — add test cases for pre-validation with nested-only deltas and confirmation display with full paths

## 5. Core: `ChangeParser.parseDeltaSpecs()` recursive scan

- [x] 5.1 Rewrite `parseDeltaSpecs()` in `src/core/parsers/change-parser.ts` to recursively scan the `specs/` directory; use full relative path as the `specName` in each delta
- [x] 5.2 Update `test/core/parsers/change-parser.test.ts` — add test cases for nested delta spec discovery via `change show --json --deltas-only`
- [x] 5.3 Update `test/core/commands/change-command.show-validate.test.ts` if it asserts on delta spec discovery
- [x] 5.4 Update `test/core/commands/change-command.list.test.ts` — add test cases verifying `change list` correctly counts nested delta specs (deltaCount / --long output)

## 6. Commands: Spec matching logic

- [x] 6.1 Extract shared `findSpecMatches(specs, itemName)` utility function supporting full-path exact match and leaf-name match with ambiguity detection; normalize Windows backslashes to forward-slash before matching
- [x] 6.2 Update `src/commands/show.ts` — replace `specs.includes(itemName)` with `findSpecMatches()` and handle ambiguity (single match → resolve; multiple → error with list; zero → not found)
- [x] 6.3 Update `src/commands/validate.ts` — replace `specs.includes(itemName)` with `findSpecMatches()` and handle ambiguity
- [x] 6.4 Update `src/commands/spec.ts` — rewrite `spec show` and `spec validate` to use `findSpecMatches()` for leaf-name resolution and ambiguity handling; update `spec list` to use recursive `getSpecIds()` or equivalent recursive scan
- [x] 6.5 Update `test/commands/show.test.ts` — add test cases for leaf-name matching, full-path matching, and ambiguity handling
- [x] 6.6 Update `test/commands/validate.test.ts` — add test cases for nested spec validation commands
- [x] 6.7 Update `test/commands/spec.test.ts` and `test/commands/spec.interactive-show.test.ts` — add test cases for nested spec display, leaf-name resolution, and ambiguity error

## 7. Commands: List and View recursive scan

- [x] 7.1 Update `src/core/list.ts` — replace one-level scan with recursive traversal (call `getSpecIds()` or reimplement) so `list --specs` shows full paths
- [x] 7.2 Update `src/core/view.ts` — replace one-level scan with recursive traversal so dashboard discovers nested specs
- [x] 7.3 Update `test/core/list.test.ts` — add test cases for nested spec discovery
- [x] 7.4 Update `test/core/view.test.ts` — add test cases for nested spec discovery

## 8. Skill templates

- [x] 8.1 Update `src/core/templates/workflows/sync-specs.ts` — modify skill instruction text to describe recursive scanning, path mirroring, and nested directory creation
- [x] 8.2 Update `src/core/templates/workflows/archive-change.ts` — update sync-related path references to use nested paths in examples and instructions
- [x] 8.3 Update `test/core/templates/skill-templates-parity.test.ts` if it verifies template content

## 9. Completion provider

- [x] 9.1 Verify `src/core/completions/completion-provider.ts` — `getSpecIds()` call should work without changes since it delegates to `item-discovery.ts`
- [x] 9.2 Update completion-related tests if they assert on spec ID format

## 10. Run all tests

- [x] 10.1 Run full test suite (`pnpm test`) and fix any remaining failures
- [x] 10.2 Verify cross-platform path handling (forward-slash return values + `path.join()` for filesystem access + Windows input normalization)

## 11. External `ue-spec-driven` schema update

- [x] 11.1 Update `openspec/schemas/ue-spec-driven/schema.yaml` — modify proposal artifact `instruction` to guide agent to examine spec tree and organize delta specs in nested paths
- [x] 11.2 Update `openspec/schemas/ue-spec-driven/schema.yaml` — modify specs artifact `instruction` to explain delta spec directory structure must mirror target paths
- [x] 11.3 Update `openspec/schemas/ue-spec-driven/templates/proposal.md` — add nested path hints to capabilities section

Note: the `ue-spec-driven` schema is located at `G:\UE\zhangheng_xdrpg_develop_DESKTOP-CSJ9AFA_9112\openspec\schemas\ue-spec-driven\`, outside the OpenSpec repo.
