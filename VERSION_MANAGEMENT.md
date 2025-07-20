# Automated Version Management

The PasskeyMe SDK uses [semantic-release](https://semantic-release.gitbook.io/) to automate version management and NPM publishing based on conventional commit messages.

## How it Works

When you push changes to the `main` branch, the CI/CD pipeline automatically:

1. Analyzes commit messages to determine the type of release (patch, minor, major)
2. Bumps version numbers accordingly
3. Updates cross-package dependencies 
4. Publishes packages to NPM
5. Creates GitHub releases with changelogs

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

### Patch Release (1.0.0 → 1.0.1)
```
fix: resolve authentication error in Safari
docs: update API documentation
```

### Minor Release (1.0.0 → 1.1.0)
```
feat: add biometric authentication support
feat: implement new auth callback options
```

### Major Release (1.0.0 → 2.0.0)
```
feat!: redesign authentication API
feat: remove deprecated methods

BREAKING CHANGE: The authenticate() method now returns a Promise instead of using callbacks
```

## Development Workflow

1. **Local Development**: Use file references (`file:../core`) for cross-package development
2. **Make Changes**: Implement features, fix bugs, etc.
3. **Commit with Convention**: Use conventional commit messages
4. **Push to Main**: Automated release process handles everything else

## Manual Testing

To test the release process locally:

```bash
# Dry run (doesn't publish)
npx semantic-release --dry-run

# Check what would be released
npx semantic-release --dry-run --debug
```

## Package Synchronization

The system automatically:
- Publishes `@passkeyme/auth` first
- Updates `@passkeyme/react-auth` to depend on the new core version
- Publishes `@passkeyme/react-auth` with correct dependencies

No manual version bumping or dependency management required!
