# 🥷 Stealth Git - Advanced Git Stealth Operations Toolkit

A comprehensive toolkit for advanced git operations focused on privacy, anonymity, and operational security. Perfect for security researchers, privacy advocates, and anyone who needs sophisticated git workflow management.

## ⚠️ Disclaimer

This toolkit is designed for legitimate privacy and security purposes. Always ensure you comply with applicable laws and regulations. Use responsibly.

## 🚀 Features

### 1. Identity Management
- **Multiple Personas**: Manage unlimited git identities
- **Quick Switching**: Instantly switch between identities (local or global)
- **Random Generation**: Generate realistic random identities
- **GPG Integration**: Support for commit signing with GPG keys

### 2. Commit Obfuscation
- **Timestamp Randomization**: Randomize commit timestamps to obscure work patterns
- **Time Offset**: Commit with custom time offsets
- **Noise Commits**: Generate realistic-looking noise commits
- **Commit Sequences**: Create multiple commits with randomized timing
- **Co-author Support**: Add multiple co-authors to commits

### 3. History Sanitization
- **File Removal**: Completely remove files from git history
- **Pattern Removal**: Remove files matching patterns from entire history
- **Author Rewriting**: Change author information across all commits
- **Date Rewriting**: Rewrite commit dates with randomization
- **Message Sanitization**: Find and replace patterns in commit messages
- **Clean Branches**: Create orphan branches with clean history

### 4. Secure Operations
- **Secure Branches**: Create branches with randomized names
- **Anonymous Remotes**: Add remotes with obfuscated names
- **Reflog Management**: Disable and clear reflog for privacy
- **Branch Obfuscation**: Rename branches to random hashes
- **Dangling Commit Recovery**: Find and recover lost commits
- **Detached Commits**: Create commits in detached HEAD state
- **Mirror Operations**: Mirror push to remotes

## 📦 Installation

```bash
cd stealth-git
npm install
npm run build
npm link  # Optional: for global CLI access
```

## 🎯 Quick Start

### Identity Management

```bash
# Add a new identity
stealth-git identity add -a work -n "John Doe" -e "john@example.com"

# Generate a random identity
stealth-git identity generate --save

# List all identities
stealth-git identity list

# Switch to an identity (local repo)
stealth-git identity switch work

# Switch globally
stealth-git identity switch work --global

# Show current identity
stealth-git identity current

# Remove an identity
stealth-git identity remove work
```

### Commit Obfuscation

```bash
# Create a commit with randomized timestamp
stealth-git commit create -m "Update feature" --randomize-time

# Create commit with specific time offset (7 days ago)
stealth-git commit create -m "Fix bug" --time-offset -604800000

# Amend last commit with randomized time
stealth-git commit amend --randomize-time

# Create a sequence of commits
stealth-git commit sequence "First commit" "Second commit" "Third commit" --randomize-time

# Create a noise commit (random message)
stealth-git commit noise

# Create commit with custom author
stealth-git commit create -m "Update" --author "Jane Doe <jane@example.com>"

# Create empty commit
stealth-git commit create -m "Trigger CI" --allow-empty
```

### History Sanitization

```bash
# Remove a file from entire history
stealth-git history remove-file secrets.txt

# Remove all log files from history
stealth-git history remove-pattern "*.log"

# Rewrite author information
stealth-git history rewrite-author \
  --old-email old@example.com \
  --new-name "New Name" \
  --new-email new@example.com

# Create a clean orphan branch
stealth-git history clean-branch main clean-main
```

### Secure Operations

```bash
# Create a secure branch with random name
stealth-git secure branch
stealth-git secure branch --base feature

# Add an anonymous remote
stealth-git secure remote https://github.com/user/repo.git
stealth-git secure remote https://github.com/user/repo.git --alias myremote

# Push anonymously
stealth-git secure push origin main
stealth-git secure push origin main --force

# Disable and clear reflog
stealth-git secure disable-reflog

# Obfuscate branch name
stealth-git secure obfuscate-branch feature-branch

# List dangling commits
stealth-git secure list-dangling

# Recover a dangling commit
stealth-git secure recover abc123def456 recovered-branch
```

## 🔧 Programmatic Usage

You can also use the toolkit programmatically in your Node.js/TypeScript projects:

```typescript
import { 
  IdentityManager, 
  CommitObfuscator, 
  HistorySanitizer, 
  SecureOperations 
} from 'stealth-git';

// Identity Management
const identityManager = new IdentityManager();
identityManager.addIdentity({
  alias: 'anon',
  name: 'Anonymous User',
  email: 'anon@protonmail.com'
});
identityManager.switchIdentity('anon', 'local');

// Commit Obfuscation
const obfuscator = new CommitObfuscator();
obfuscator.createCommit({
  message: 'Update feature',
  randomizeTime: true,
  allowEmpty: false
});

// History Sanitization
const sanitizer = new HistorySanitizer();
sanitizer.removeFileFromHistory('sensitive-data.txt');
sanitizer.rewriteAuthor(
  'old@email.com',
  'New Name',
  'new@email.com'
);

// Secure Operations
const secureOps = new SecureOperations();
const branchName = secureOps.createSecureBranch('feature');
secureOps.disableReflog();
```

## 🛡️ Security Best Practices

1. **Identity Isolation**: Use different identities for different projects
2. **Timestamp Randomization**: Always randomize timestamps when privacy is critical
3. **Reflog Management**: Disable reflog for sensitive operations
4. **History Sanitization**: Regularly audit and sanitize commit history
5. **Remote Management**: Use anonymous remotes when pushing to public repositories
6. **Branch Obfuscation**: Obfuscate branch names for sensitive work
7. **GPG Signing**: Use GPG signing for authenticity when appropriate

## 🎭 Advanced Workflows

### Complete Identity Switch
```bash
# Generate and switch to a new random identity
stealth-git identity generate --save
ALIAS=$(stealth-git identity list | tail -1 | cut -d: -f1)
stealth-git identity switch $ALIAS

# Create secure branch and commit
stealth-git secure branch --base feature
stealth-git commit create -m "Implement feature" --randomize-time
```

### History Cleanup Workflow
```bash
# Remove sensitive files
stealth-git history remove-file .env
stealth-git history remove-pattern "*.key"

# Rewrite author information
stealth-git history rewrite-author \
  --old-email personal@email.com \
  --new-name "Work Name" \
  --new-email work@company.com

# Clean up
stealth-git secure disable-reflog
```

### Anonymous Contribution Workflow
```bash
# Setup anonymous identity
stealth-git identity add -a anon -n "Anonymous" -e "anon@protonmail.com"
stealth-git identity switch anon

# Create secure branch
BRANCH=$(stealth-git secure branch --base contribution)

# Make commits with randomized timestamps
stealth-git commit create -m "Add feature" --randomize-time
stealth-git commit create -m "Add tests" --randomize-time

# Push anonymously
stealth-git secure remote https://github.com/project/repo.git
stealth-git secure push anon-* $BRANCH
```

## 📚 Command Reference

### Identity Commands
- `identity add` - Add a new identity
- `identity remove <alias>` - Remove an identity
- `identity list` - List all identities
- `identity switch <alias>` - Switch to an identity
- `identity current` - Show current identity
- `identity generate` - Generate random identity

### Commit Commands
- `commit create` - Create obfuscated commit
- `commit amend` - Amend with obfuscation
- `commit sequence` - Create commit sequence
- `commit noise` - Create noise commit

### History Commands
- `history remove-file <path>` - Remove file from history
- `history remove-pattern <pattern>` - Remove pattern from history
- `history rewrite-author` - Rewrite author info
- `history clean-branch` - Create clean branch

### Secure Commands
- `secure branch` - Create secure branch
- `secure remote <url>` - Add anonymous remote
- `secure push <remote> <branch>` - Push anonymously
- `secure disable-reflog` - Disable reflog
- `secure obfuscate-branch <branch>` - Obfuscate branch name
- `secure list-dangling` - List dangling commits
- `secure recover <hash> <branch>` - Recover commit

## 🤝 Contributing

Contributions are welcome! Please ensure all contributions maintain the security and privacy focus of this toolkit.

## 📄 License

MIT License - See LICENSE file for details

## ⚡ Performance Notes

- History rewriting operations can be slow on large repositories
- Always backup your repository before performing destructive operations
- Use `--force` flags with caution when pushing rewritten history

## 🔍 Troubleshooting

### "Identity not found" error
Make sure you've added the identity first with `identity add` or `identity generate --save`

### History rewriting fails
Ensure you have a clean working directory and all changes are committed

### Push rejected
When pushing rewritten history, you may need to use `--force` flag

## 🎓 Learning Resources

- [Git Internals](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)
- [Git Filter-Branch](https://git-scm.com/docs/git-filter-branch)
- [GPG Signing](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)

---

**Remember**: With great power comes great responsibility. Use this toolkit ethically and legally.
