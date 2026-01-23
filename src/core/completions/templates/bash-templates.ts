/**
 * Static template strings for Bash completion scripts.
 * These are Bash-specific helper functions that never change.
 */

export const BASH_DYNAMIC_HELPERS = `# Dynamic completion helpers

_ogd_complete_changes() {
  local changes
  changes=$(ogd __complete changes 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$changes" -- "$cur"))
}

_ogd_complete_specs() {
  local specs
  specs=$(ogd __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$specs" -- "$cur"))
}

_ogd_complete_items() {
  local items
  items=$(ogd __complete changes 2>/dev/null | cut -f1; ogd __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$items" -- "$cur"))
}`;
