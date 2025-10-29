# 🚀 Quick Start Guide

Get up and running with Stealth Git in 5 minutes!

## Installation

```bash
cd stealth-git
npm install
npm run build

# Optional: Install globally
npm link
```

## Your First Commands

### 1. Create Your First Identity

```bash
# Generate a random anonymous identity
stealth-git identity generate --save

# Or create a specific identity
stealth-git identity add \
  -a myalias \
  -n "Your Name" \
  -e "your.email@protonmail.com"
```

### 2. Switch to Your Identity

```bash
# List all identities
stealth-git identity list

# Switch to an identity
stealth-git identity switch myalias

# Check current identity
stealth-git identity current
```

### 3. Make Your First Stealth Commit

```bash
# Navigate to a git repository
cd /path/to/your/repo

# Make some changes
echo "test" > test.txt
git add test.txt

# Create a commit with randomized timestamp
stealth-git commit create -m "Add test file" --randomize-time
```

### 4. Create a Secure Branch

```bash
# Create a branch with a random name
stealth-git secure branch --base feature

# This creates something like: feature-a1b2c3d4
```

### 5. Clean Up Your Tracks

```bash
# Disable and clear reflog
stealth-git secure disable-reflog
```

## Common Workflows

### Anonymous Contribution

```bash
# 1. Generate anonymous identity
stealth-git identity generate --save
stealth-git identity switch random-1234567890

# 2. Create secure branch
stealth-git secure branch --base contribution

# 3. Make changes and commit
git add .
stealth-git commit create -m "Add feature" --randomize-time

# 4. Push anonymously
stealth-git secure remote https://github.com/user/repo.git
stealth-git secure push anon-* secure-a1b2c3d4
```

### Multiple Work Identities

```bash
# Setup
stealth-git identity add -a work -n "Work Name" -e "work@company.com"
stealth-git identity add -a personal -n "Personal Name" -e "personal@email.com"

# Switch based on project
cd ~/work-project && stealth-git identity switch work
cd ~/personal-project && stealth-git identity switch personal
```

### Remove Sensitive File from History

```bash
# Backup first!
git clone --mirror . ../backup.git

# Remove the file
stealth-git history remove-file secrets.txt

# Clean up
stealth-git secure disable-reflog
```

## Essential Commands Cheat Sheet

### Identity Management
```bash
stealth-git identity add -a <alias> -n "<name>" -e "<email>"
stealth-git identity list
stealth-git identity switch <alias>
stealth-git identity current
stealth-git identity generate --save
```

### Commits
```bash
stealth-git commit create -m "message" --randomize-time
stealth-git commit amend --randomize-time
stealth-git commit noise
```

### History
```bash
stealth-git history remove-file <path>
stealth-git history remove-pattern "*.log"
stealth-git history rewrite-author --old-email <old> --new-name <name> --new-email <new>
```

### Security
```bash
stealth-git secure branch --base <name>
stealth-git secure remote <url>
stealth-git secure disable-reflog
stealth-git secure obfuscate-branch <branch>
```

## Tips for Beginners

1. **Always check your current identity** before committing:
   ```bash
   stealth-git identity current
   ```

2. **Backup before history operations**:
   ```bash
   git clone --mirror . ../backup.git
   ```

3. **Use randomized timestamps** for privacy:
   ```bash
   stealth-git commit create -m "message" --randomize-time
   ```

4. **Clean up after sensitive operations**:
   ```bash
   stealth-git secure disable-reflog
   git gc --prune=now --aggressive
   ```

5. **Test on a copy first** when sanitizing history:
   ```bash
   git clone . ../test-repo
   cd ../test-repo
   # Test here
   ```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out [EXAMPLES.md](EXAMPLES.md) for real-world scenarios
- Review [SECURITY.md](SECURITY.md) for security best practices

## Getting Help

```bash
# General help
stealth-git --help

# Command-specific help
stealth-git identity --help
stealth-git commit --help
stealth-git history --help
stealth-git secure --help
```

## Troubleshooting

### "Identity not found"
Make sure you've added the identity first:
```bash
stealth-git identity list
stealth-git identity add -a myalias -n "Name" -e "email@example.com"
```

### "Not a git repository"
Navigate to a git repository first:
```bash
cd /path/to/git/repo
git status  # Verify it's a git repo
```

### Commands not working
Make sure you've built the project:
```bash
npm run build
```

---

Happy stealthy git operations! 🥷
