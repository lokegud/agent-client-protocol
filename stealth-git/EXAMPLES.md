# 🎯 Stealth Git - Practical Examples

## Scenario 1: Anonymous Open Source Contribution

You want to contribute to an open source project but maintain complete anonymity.

```bash
# Step 1: Generate and use a random identity
stealth-git identity generate --save
stealth-git identity switch random-1234567890

# Step 2: Clone the repository
git clone https://github.com/project/repo.git
cd repo

# Step 3: Create a secure branch
stealth-git secure branch --base fix-bug-123

# Step 4: Make your changes
# ... edit files ...

# Step 5: Commit with randomized timestamps
stealth-git commit create -m "Fix memory leak in parser" --randomize-time
stealth-git commit create -m "Add test coverage" --randomize-time

# Step 6: Add anonymous remote and push
stealth-git secure remote https://github.com/your-anon-fork/repo.git
stealth-git secure push anon-* secure-a1b2c3d4

# Step 7: Clean up local traces
stealth-git secure disable-reflog
```

## Scenario 2: Sanitizing Repository Before Going Public

You have a private repository with sensitive data that you want to make public.

```bash
# Step 1: Create a backup
git clone --mirror . ../backup.git

# Step 2: Remove sensitive files
stealth-git history remove-file .env
stealth-git history remove-file config/secrets.yml
stealth-git history remove-pattern "*.key"
stealth-git history remove-pattern "*.pem"

# Step 3: Sanitize commit messages (remove ticket numbers, internal references)
# This requires manual git filter-branch or BFG Repo-Cleaner

# Step 4: Rewrite author information if needed
stealth-git history rewrite-author \
  --old-email internal@company.com \
  --new-name "Public Team" \
  --new-email public@company.com

# Step 5: Create clean branch
stealth-git history clean-branch main public-main

# Step 6: Verify and push
git checkout public-main
git log --all --oneline
git push public-remote public-main:main --force
```

## Scenario 3: Multiple Work Identities

You work on multiple projects with different identities (work, personal, freelance).

```bash
# Setup identities
stealth-git identity add -a work -n "John Doe" -e "john.doe@company.com" -k WORK_GPG_KEY
stealth-git identity add -a personal -n "John D" -e "john@personal.com" -k PERSONAL_GPG_KEY
stealth-git identity add -a freelance -n "JD" -e "jd@freelance.com"

# List identities
stealth-git identity list

# Switch based on project
cd ~/work/company-project
stealth-git identity switch work

cd ~/personal/side-project
stealth-git identity switch personal

cd ~/freelance/client-project
stealth-git identity switch freelance

# Check current identity
stealth-git identity current
```

## Scenario 4: Creating Plausible Deniability

You want to create commits that appear to be from different times and authors.

```bash
# Create multiple identities
stealth-git identity add -a alice -n "Alice Smith" -e "alice@example.com"
stealth-git identity add -a bob -n "Bob Jones" -e "bob@example.com"

# Switch to Alice and commit
stealth-git identity switch alice
stealth-git commit create -m "Implement feature A" --randomize-time

# Switch to Bob and commit
stealth-git identity switch bob
stealth-git commit create -m "Implement feature B" --randomize-time

# Create noise commits to obscure patterns
stealth-git commit noise
stealth-git commit noise

# Create a sequence with different timestamps
stealth-git commit sequence \
  "Update dependencies" \
  "Fix linting issues" \
  "Update documentation" \
  --randomize-time
```

## Scenario 5: Recovering from Accidental Commit

You accidentally committed sensitive data and pushed it.

```bash
# Step 1: Remove the sensitive file from history
stealth-git history remove-file sensitive-data.txt

# Step 2: Verify it's gone
git log --all --full-history -- sensitive-data.txt

# Step 3: Force push to remote (WARNING: coordinate with team)
git push origin --force --all
git push origin --force --tags

# Step 4: Clean up local repository
stealth-git secure disable-reflog
git gc --prune=now --aggressive

# Step 5: Notify team to re-clone
echo "Team members should delete and re-clone the repository"
```

## Scenario 6: Maintaining Operational Security

You're working on a sensitive project and need maximum operational security.

```bash
# Step 1: Use a random identity
stealth-git identity generate --save
IDENTITY=$(stealth-git identity list | tail -1 | cut -d: -f1)
stealth-git identity switch $IDENTITY

# Step 2: Disable reflog from the start
stealth-git secure disable-reflog

# Step 3: Use secure branches
stealth-git secure branch --base feature

# Step 4: Commit with randomized timestamps
stealth-git commit create -m "Initial implementation" --randomize-time --allow-empty

# Step 5: Work in detached HEAD when needed
git checkout --detach
# ... make changes ...
stealth-git commit create -m "Experimental changes" --randomize-time

# Step 6: If you need to save the work
BRANCH=$(stealth-git secure branch --base experiment)
git checkout $BRANCH

# Step 7: Use anonymous remotes
stealth-git secure remote https://git-host.onion/repo.git
stealth-git secure push anon-* $BRANCH
```

## Scenario 7: Time-Shifted Development

You want commits to appear as if they were made over several weeks, not in one day.

```bash
# Create commits with specific time offsets
# -604800000 ms = -7 days
# -1209600000 ms = -14 days
# -1814400000 ms = -21 days

stealth-git commit create -m "Initial commit" --time-offset -1814400000
stealth-git commit create -m "Add core functionality" --time-offset -1209600000
stealth-git commit create -m "Add tests" --time-offset -604800000
stealth-git commit create -m "Update documentation" --time-offset -86400000
stealth-git commit create -m "Final touches" --randomize-time
```

## Scenario 8: Branch Name Obfuscation

You want to hide the purpose of branches from casual observers.

```bash
# Instead of descriptive branch names
# git checkout -b fix-security-vulnerability
# git checkout -b implement-secret-feature

# Use obfuscated names
stealth-git secure branch
# Creates: secure-a1b2c3d4

stealth-git secure branch --base work
# Creates: work-e5f6g7h8

# Or obfuscate existing branches
git checkout -b my-secret-feature
stealth-git secure obfuscate-branch my-secret-feature
# Renames to: 9i0j1k2l
```

## Scenario 9: Collaborative Anonymous Work

Multiple people working on a project anonymously.

```bash
# Each contributor generates their own identity
stealth-git identity generate --save
stealth-git identity switch random-1234567890

# Use a shared anonymous remote
stealth-git secure remote https://anonymous-git-host.onion/project.git --alias shared

# Create secure branches
stealth-git secure branch --base contribution

# Commit with randomized times
stealth-git commit create -m "Add feature X" --randomize-time

# Push anonymously
stealth-git secure push shared secure-a1b2c3d4

# Add co-authors if needed (using anonymous identities)
stealth-git commit create \
  -m "Collaborative feature" \
  --randomize-time \
  --author "Anon1 <anon1@protonmail.com>"
```

## Scenario 10: Emergency History Rewrite

You need to quickly sanitize a repository that's about to be audited.

```bash
#!/bin/bash
# emergency-sanitize.sh

# Backup first
git clone --mirror . ../emergency-backup.git

# Remove common sensitive files
stealth-git history remove-pattern "*.env"
stealth-git history remove-pattern "*.key"
stealth-git history remove-pattern "*.pem"
stealth-git history remove-pattern "*.p12"
stealth-git history remove-pattern "*secret*"
stealth-git history remove-pattern "*password*"

# Remove specific sensitive files
stealth-git history remove-file config/database.yml
stealth-git history remove-file .aws/credentials

# Rewrite any internal email addresses
stealth-git history rewrite-author \
  --old-email internal@company.local \
  --new-name "Development Team" \
  --new-email dev@company.com

# Clean up
stealth-git secure disable-reflog
git gc --prune=now --aggressive

echo "Sanitization complete. Review changes before pushing."
```

## Scenario 11: Forensic Counter-Measures

Making it difficult to perform forensic analysis on your git history.

```bash
# Create noise commits to obscure real work
for i in {1..10}; do
  stealth-git commit noise
  sleep $((RANDOM % 5))
done

# Interleave real commits with noise
stealth-git commit create -m "Real work" --randomize-time
stealth-git commit noise
stealth-git commit noise
stealth-git commit create -m "More real work" --randomize-time
stealth-git commit noise

# Obfuscate branch names
for branch in $(git branch | grep -v "main\|master"); do
  stealth-git secure obfuscate-branch $branch
done

# Disable reflog
stealth-git secure disable-reflog

# Use detached commits for sensitive work
git checkout --detach
# ... work ...
stealth-git commit create -m "Sensitive changes" --randomize-time
# Don't create a branch unless necessary
```

## Scenario 12: Identity Rotation

Regularly rotating identities for enhanced privacy.

```bash
#!/bin/bash
# rotate-identity.sh

# Generate new identity
stealth-git identity generate --save

# Get the new identity alias
NEW_IDENTITY=$(stealth-git identity list | tail -1 | cut -d: -f1)

# Switch to new identity
stealth-git identity switch $NEW_IDENTITY

# Optionally remove old identity
# stealth-git identity remove old-identity-alias

echo "Rotated to new identity: $NEW_IDENTITY"
stealth-git identity current
```

## Tips and Best Practices

1. **Always backup before history rewriting**: `git clone --mirror . ../backup.git`
2. **Test on a copy first**: Clone your repo and test sanitization on the copy
3. **Coordinate force pushes**: If working with a team, coordinate before force pushing
4. **Use Tor/VPN**: Combine with network anonymity tools for maximum privacy
5. **Verify changes**: Always review git log after history modifications
6. **Document your workflow**: Keep encrypted notes of which identities are used where
7. **Rotate identities**: Don't use the same identity for too long
8. **Clean up regularly**: Periodically run reflog cleanup and gc
9. **Use GPG signing carefully**: Signing can link identities together
10. **Consider the metadata**: Remember that git stores more than just code

## Advanced Automation

Create a shell function for quick identity switching:

```bash
# Add to ~/.bashrc or ~/.zshrc
sgit() {
  case $1 in
    work)
      stealth-git identity switch work
      ;;
    personal)
      stealth-git identity switch personal
      ;;
    anon)
      stealth-git identity generate --save
      IDENTITY=$(stealth-git identity list | tail -1 | cut -d: -f1)
      stealth-git identity switch $IDENTITY
      ;;
    *)
      stealth-git "$@"
      ;;
  esac
}

# Usage:
# sgit work          # Switch to work identity
# sgit anon          # Generate and switch to random identity
# sgit commit create -m "message" --randomize-time
```

---

Remember: These tools are powerful. Use them responsibly and ethically.
