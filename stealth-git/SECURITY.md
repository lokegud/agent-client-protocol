# 🔒 Security Considerations

## Overview

Stealth Git is a powerful toolkit designed for privacy and operational security in git workflows. However, like any security tool, it must be used correctly to be effective. This document outlines important security considerations, limitations, and best practices.

## ⚠️ Important Limitations

### 1. Network-Level Anonymity

**Stealth Git does NOT provide network-level anonymity.**

- Your IP address is still visible when pushing/pulling from remotes
- Git operations can be logged by remote servers
- Use Tor, VPN, or other network anonymity tools in conjunction with Stealth Git

```bash
# Example: Using Tor with git
git config --global http.proxy socks5://127.0.0.1:9050
git config --global https.proxy socks5://127.0.0.1:9050
```

### 2. Existing History

**Stealth Git cannot protect information already pushed to public remotes.**

- Once data is pushed, it may be cloned/archived by others
- History rewriting only affects your local repository and future pushes
- Assume any data pushed to public repositories is permanent

### 3. Metadata Leakage

**Git stores extensive metadata that can reveal patterns:**

- File modification times
- Commit object sizes
- Tree structure changes
- Merge patterns
- Branch relationships

### 4. Forensic Analysis

**Determined forensic analysis may still reveal information:**

- Coding style analysis (stylometry)
- Commit message patterns
- Time zone information in timestamps
- File system artifacts
- Operating system metadata

## 🛡️ Threat Model

### What Stealth Git Protects Against

✅ **Casual observation** of git history  
✅ **Basic identity correlation** across repositories  
✅ **Timestamp-based pattern analysis**  
✅ **Accidental exposure** of sensitive files in history  
✅ **Simple author attribution**  

### What Stealth Git Does NOT Protect Against

❌ **Network-level surveillance** (use Tor/VPN)  
❌ **Advanced forensic analysis** (stylometry, timing attacks)  
❌ **Compromised endpoints** (keyloggers, malware)  
❌ **Social engineering** attacks  
❌ **Legal compulsion** to reveal identity  
❌ **Data already published** to public repositories  

## 🔐 Best Practices

### Identity Management

1. **Separate Identities by Context**
   ```bash
   # Work identity
   stealth-git identity add -a work -n "John Doe" -e "john@company.com"
   
   # Personal identity
   stealth-git identity add -a personal -n "John" -e "john@personal.com"
   
   # Anonymous identity
   stealth-git identity generate --save
   ```

2. **Use Disposable Email Addresses**
   - ProtonMail, Tutanota, or temporary email services
   - Never reuse email addresses across contexts
   - Consider using email aliases

3. **Rotate Identities Regularly**
   ```bash
   # Generate new identity monthly
   stealth-git identity generate --save
   stealth-git identity switch random-new-id
   ```

4. **Never Mix Identities**
   - Don't commit with one identity and push with another
   - Keep separate git repositories for different identities
   - Use separate SSH keys for each identity

### Commit Hygiene

1. **Always Randomize Timestamps for Sensitive Work**
   ```bash
   stealth-git commit create -m "Sensitive work" --randomize-time
   ```

2. **Use Noise Commits to Obscure Patterns**
   ```bash
   # Add noise before and after real commits
   stealth-git commit noise
   stealth-git commit create -m "Real work" --randomize-time
   stealth-git commit noise
   ```

3. **Avoid Distinctive Commit Messages**
   - Don't use unique phrases or personal idioms
   - Keep messages generic and professional
   - Avoid ticket numbers, internal references

4. **Review Diffs Before Committing**
   ```bash
   git diff --cached
   # Check for sensitive data, comments, debug code
   ```

### History Sanitization

1. **Always Backup Before Rewriting History**
   ```bash
   git clone --mirror . ../backup-$(date +%Y%m%d).git
   ```

2. **Test on a Copy First**
   ```bash
   git clone . ../test-repo
   cd ../test-repo
   # Test sanitization here
   ```

3. **Verify After Sanitization**
   ```bash
   # Check that sensitive files are gone
   git log --all --full-history -- sensitive-file.txt
   
   # Check for sensitive patterns
   git log --all --grep="SECRET"
   
   # Review all commits
   git log --all --oneline --graph
   ```

4. **Force Push Carefully**
   ```bash
   # Coordinate with team first
   git push --force-with-lease origin main
   ```

### Operational Security

1. **Disable Reflog for Sensitive Operations**
   ```bash
   stealth-git secure disable-reflog
   ```

2. **Use Secure Branches**
   ```bash
   stealth-git secure branch --base feature
   ```

3. **Clean Up Regularly**
   ```bash
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

4. **Use Detached HEAD for Experimental Work**
   ```bash
   git checkout --detach
   # Work here won't be tracked in reflog
   ```

### Network Security

1. **Use Tor for Anonymous Operations**
   ```bash
   # Configure git to use Tor
   git config --global http.proxy socks5h://127.0.0.1:9050
   git config --global https.proxy socks5h://127.0.0.1:9050
   ```

2. **Use SSH with Tor**
   ```bash
   # ~/.ssh/config
   Host github.com
       ProxyCommand nc -X 5 -x 127.0.0.1:9050 %h %p
   ```

3. **Verify TLS Certificates**
   ```bash
   git config --global http.sslVerify true
   ```

4. **Use Anonymous Git Hosting**
   - Consider self-hosted git servers
   - Use Tor hidden services
   - Avoid platforms that require identity verification

## 🚨 Common Mistakes

### 1. Forgetting to Switch Identities

```bash
# WRONG: Committing with wrong identity
git commit -m "Personal project work"

# RIGHT: Always check current identity first
stealth-git identity current
stealth-git identity switch personal
stealth-git commit create -m "Personal project work" --randomize-time
```

### 2. Pushing Before Sanitizing

```bash
# WRONG: Push then sanitize
git push origin main
stealth-git history remove-file secrets.txt  # Too late!

# RIGHT: Sanitize before first push
stealth-git history remove-file secrets.txt
git push origin main
```

### 3. Reusing Identities Across Contexts

```bash
# WRONG: Same identity for work and anonymous projects
stealth-git identity switch work  # In anonymous project

# RIGHT: Separate identities
stealth-git identity switch anon  # In anonymous project
stealth-git identity switch work  # In work project
```

### 4. Ignoring Metadata

```bash
# WRONG: Only changing author name
git commit --author="Anon <anon@email.com>" -m "Work"

# RIGHT: Use stealth-git to handle all metadata
stealth-git identity switch anon
stealth-git commit create -m "Work" --randomize-time
```

### 5. Not Cleaning Up

```bash
# WRONG: Leave reflog and dangling commits
git filter-branch ...
# Reflog still contains old commits!

# RIGHT: Clean up thoroughly
stealth-git history remove-file secrets.txt
stealth-git secure disable-reflog
git gc --prune=now --aggressive
```

## 🔍 Detection Vectors

### What Can Still Identify You

1. **Coding Style (Stylometry)**
   - Variable naming conventions
   - Code structure patterns
   - Comment style
   - Indentation preferences
   - Language idioms

2. **Behavioral Patterns**
   - Commit frequency patterns
   - Work hours (even with randomization)
   - Commit size patterns
   - File organization preferences

3. **Technical Fingerprints**
   - Git version used
   - Operating system (line endings)
   - Editor configuration (trailing whitespace)
   - Timezone (even with randomized times)

4. **Social Connections**
   - Co-authors
   - Repository forks
   - Issue/PR interactions
   - Code review patterns

### Mitigation Strategies

1. **Normalize Coding Style**
   - Use automated formatters (prettier, black, gofmt)
   - Follow project conventions strictly
   - Avoid personal idioms

2. **Randomize Patterns**
   - Vary commit sizes
   - Use noise commits
   - Randomize timestamps widely

3. **Sanitize Technical Fingerprints**
   ```bash
   # Normalize line endings
   git config --global core.autocrlf input
   
   # Use consistent git version
   # Consider using git in a container
   ```

4. **Minimize Social Connections**
   - Avoid co-authoring when anonymous
   - Don't fork from personal accounts
   - Use separate accounts for interactions

## 🎯 Recommended Workflows

### High Security Workflow

```bash
# 1. Use Tor/VPN
# Start Tor first

# 2. Generate fresh identity
stealth-git identity generate --save
IDENTITY=$(stealth-git identity list | tail -1 | cut -d: -f1)
stealth-git identity switch $IDENTITY

# 3. Disable reflog
stealth-git secure disable-reflog

# 4. Use secure branch
stealth-git secure branch

# 5. Commit with randomization
stealth-git commit create -m "Work" --randomize-time

# 6. Add noise
stealth-git commit noise

# 7. Push anonymously
stealth-git secure remote https://anonymous-host.onion/repo.git
stealth-git secure push anon-* secure-branch

# 8. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Medium Security Workflow

```bash
# 1. Use VPN

# 2. Use pseudonymous identity
stealth-git identity switch pseudonym

# 3. Randomize timestamps
stealth-git commit create -m "Work" --randomize-time

# 4. Push normally
git push origin main
```

### Low Security Workflow

```bash
# 1. Use separate identity
stealth-git identity switch personal

# 2. Commit normally
git commit -m "Work"

# 3. Push normally
git push origin main
```

## 📚 Additional Resources

- [Git Internals](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)
- [Tor Project](https://www.torproject.org/)
- [ProtonMail](https://protonmail.com/)
- [Tails OS](https://tails.boum.org/) - Amnesic operating system
- [Whonix](https://www.whonix.org/) - Anonymous operating system

## 🆘 Emergency Procedures

### If You Accidentally Exposed Sensitive Data

1. **Act Immediately**
   ```bash
   # Remove from history
   stealth-git history remove-file sensitive-file.txt
   
   # Force push
   git push --force origin --all
   git push --force origin --tags
   ```

2. **Rotate Credentials**
   - Change any exposed passwords/keys immediately
   - Revoke API tokens
   - Update secrets in production

3. **Notify Stakeholders**
   - Inform team members
   - Contact security team
   - Document the incident

4. **Monitor for Abuse**
   - Watch for unauthorized access
   - Check logs for suspicious activity
   - Set up alerts

### If Your Identity Is Compromised

1. **Stop Using the Identity**
   ```bash
   stealth-git identity remove compromised-identity
   ```

2. **Generate New Identity**
   ```bash
   stealth-git identity generate --save
   ```

3. **Review All Repositories**
   - Check what was committed with compromised identity
   - Consider sanitizing history if necessary

4. **Change Network Security**
   - Switch VPN/Tor circuits
   - Use different network
   - Clear browser data

## ⚖️ Legal Considerations

- **Know Your Jurisdiction**: Laws regarding anonymity vary by country
- **Terms of Service**: Some platforms prohibit anonymous accounts
- **Whistleblower Protections**: Understand your legal protections
- **Consult Legal Counsel**: When in doubt, seek legal advice

## 🤝 Responsible Use

This toolkit is designed for legitimate privacy and security purposes:

- ✅ Protecting whistleblowers
- ✅ Security research
- ✅ Privacy-conscious development
- ✅ Separating work/personal identities
- ✅ Protecting against doxxing

Do NOT use for:

- ❌ Illegal activities
- ❌ Harassment or abuse
- ❌ Evading accountability for harmful actions
- ❌ Violating terms of service maliciously

---

**Remember**: Perfect anonymity is nearly impossible. Use defense in depth, assume compromise, and always have a backup plan.
