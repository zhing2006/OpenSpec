## Why

OGD users on NixOS or using the Nix package manager cannot easily install or run OGD without going through npm. Adding a Nix flake makes OGD a first-class citizen in the Nix ecosystem, enabling users to run `nix run github:zhing2006/OpenGameDesign -- init` or include OGD in their development environments declaratively.

## What Changes

- Add `flake.nix` to repository root with multi-platform support (x86_64-linux, aarch64-linux, x86_64-darwin, aarch64-darwin)
- Package uses pnpm for dependency management (matching existing development workflow)
- Support both direct execution via `nix run` and installation via `nix profile install`
- Provide dev shell for contributors using Nix

## Capabilities

### New Capabilities
- `nix-flake-support`: Nix flake configuration for building and running OGD

### Modified Capabilities
- None

## Impact

- **New files**: `flake.nix` in repository root
- **Documentation**: Should add installation instructions for Nix users
- **CI/CD**: Could add flake checking to CI pipeline (optional)
- **Maintenance**: Requires updating pnpmDeps hash when dependencies change
