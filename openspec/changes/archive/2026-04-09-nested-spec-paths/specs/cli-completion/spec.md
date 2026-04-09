## MODIFIED Requirements

### Requirement: Dynamic Completions

The completion system SHALL provide context-aware dynamic completions for project-specific values. Spec ID completions SHALL use full nested paths.

#### Scenario: Completing change IDs

- **WHEN** completing arguments for commands that accept change names (show, validate, archive)
- **THEN** discover active changes from `openspec/changes/` directory
- **AND** exclude archived changes in `openspec/changes/archive/`
- **AND** return change IDs as completion suggestions
- **AND** only provide suggestions when inside an OpenSpec-enabled project

#### Scenario: Completing spec IDs with nested paths

- **WHEN** completing arguments for commands that accept spec names (show, validate)
- **THEN** recursively discover specs from `openspec/specs/` directory
- **AND** return spec IDs as full nested paths (e.g., `Client/Combat/combat-system`)
- **AND** only provide suggestions when inside an OpenSpec-enabled project

#### Scenario: Completion caching

- **WHEN** dynamic completions are requested
- **THEN** cache discovered change and spec IDs for 2 seconds
- **AND** reuse cached values for subsequent requests within cache window
- **AND** automatically refresh cache after expiration

#### Scenario: Project detection

- **WHEN** user requests completions outside an OpenSpec project
- **THEN** skip dynamic change/spec ID completions
- **AND** only suggest static commands and flags

### Requirement: Architecture Patterns

The completion implementation SHALL follow clean architecture principles with TypeScript best practices, supporting multiple shells through a plugin-based pattern.

#### Scenario: Dynamic completion providers

- **WHEN** implementing dynamic completions
- **THEN** create a `CompletionProvider` class that encapsulates project discovery logic
- **AND** implement methods:
  - `getChangeIds(): Promise<string[]>` - Discovers active change IDs
  - `getSpecIds(): Promise<string[]>` - Discovers spec IDs as full nested paths
  - `isOpenSpecProject(): boolean` - Checks if current directory is OpenSpec-enabled
- **AND** implement caching with 2-second TTL using class properties

#### Scenario: Shell-specific generators

- **WHEN** implementing completion generators
- **THEN** create generator classes for each shell: `ZshGenerator`, `BashGenerator`, `FishGenerator`, `PowerShellGenerator`
- **AND** implement a common `CompletionGenerator` interface with method:
  - `generate(commands: CommandDefinition[]): string` - Returns complete shell script
- **AND** each generator handles shell-specific syntax, escaping, and patterns
- **AND** all generators consume the same `CommandDefinition[]` from the command registry

#### Scenario: Shell-specific installers

- **WHEN** implementing completion installers
- **THEN** create installer classes for each shell: `ZshInstaller`, `BashInstaller`, `FishInstaller`, `PowerShellInstaller`
- **AND** implement a common `CompletionInstaller` interface with methods:
  - `install(script: string): Promise<InstallationResult>` - Installs completion script
  - `uninstall(): Promise<{ success: boolean; message: string }>` - Removes completion
- **AND** each installer handles shell-specific paths, config files, and installation patterns

#### Scenario: Factory pattern for shell selection

- **WHEN** selecting shell-specific implementation
- **THEN** use `CompletionFactory` class with static methods:
  - `createGenerator(shell: SupportedShell): CompletionGenerator`
  - `createInstaller(shell: SupportedShell): CompletionInstaller`
- **AND** factory uses switch statements with TypeScript exhaustiveness checking
- **AND** adding new shell requires updating `SupportedShell` type and factory cases

#### Scenario: Command registry

- **WHEN** defining completable commands
- **THEN** create a centralized `CommandDefinition` type with properties:
  - `name: string` - Command name
  - `description: string` - Help text
  - `flags: FlagDefinition[]` - Available flags
  - `acceptsPositional: boolean` - Whether command takes positional arguments
  - `positionalType: string` - Type of positional (change-id, spec-id, path, shell)
  - `subcommands?: CommandDefinition[]` - Nested subcommands
- **AND** export a `COMMAND_REGISTRY` constant with all command definitions
- **AND** all generators consume this registry to ensure consistency across shells

#### Scenario: Type-safe shell detection

- **WHEN** implementing shell detection
- **THEN** define a `SupportedShell` type as literal type: `'zsh' | 'bash' | 'fish' | 'powershell'`
- **AND** implement `detectShell()` function in `src/utils/shell-detection.ts`
- **AND** return detected shell or throw error with supported shells list
