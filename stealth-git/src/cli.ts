#!/usr/bin/env node

import { Command } from 'commander';
import { IdentityManager } from './identity-manager.js';
import { CommitObfuscator } from './commit-obfuscator.js';
import { HistorySanitizer } from './history-sanitizer.js';
import { SecureOperations } from './secure-operations.js';

const program = new Command();

program
  .name('stealth-git')
  .description('Advanced git stealth operations toolkit')
  .version('1.0.0');

// Identity Management Commands
const identity = program.command('identity').description('Manage git identities');

identity
  .command('add')
  .description('Add a new identity')
  .requiredOption('-a, --alias <alias>', 'Identity alias')
  .requiredOption('-n, --name <name>', 'Full name')
  .requiredOption('-e, --email <email>', 'Email address')
  .option('-k, --key <key>', 'GPG signing key')
  .action((options) => {
    const manager = new IdentityManager();
    manager.addIdentity({
      alias: options.alias,
      name: options.name,
      email: options.email,
      signingKey: options.key
    });
    console.log(`✓ Identity '${options.alias}' added`);
  });

identity
  .command('remove')
  .description('Remove an identity')
  .argument('<alias>', 'Identity alias to remove')
  .action((alias) => {
    const manager = new IdentityManager();
    if (manager.removeIdentity(alias)) {
      console.log(`✓ Identity '${alias}' removed`);
    } else {
      console.log(`✗ Identity '${alias}' not found`);
    }
  });

identity
  .command('list')
  .description('List all identities')
  .action(() => {
    const manager = new IdentityManager();
    const identities = manager.listIdentities();
    if (identities.length === 0) {
      console.log('No identities found');
    } else {
      identities.forEach(id => {
        console.log(`${id.alias}: ${id.name} <${id.email}>`);
      });
    }
  });

identity
  .command('switch')
  .description('Switch to an identity')
  .argument('<alias>', 'Identity alias')
  .option('-g, --global', 'Apply globally')
  .action((alias, options) => {
    const manager = new IdentityManager();
    const scope = options.global ? 'global' : 'local';
    manager.switchIdentity(alias, scope);
    console.log(`✓ Switched to identity '${alias}' (${scope})`);
  });

identity
  .command('current')
  .description('Show current identity')
  .action(() => {
    const manager = new IdentityManager();
    const current = manager.getCurrentIdentity();
    console.log(`${current.name} <${current.email}>`);
  });

identity
  .command('generate')
  .description('Generate a random identity')
  .option('-s, --save', 'Save the generated identity')
  .action((options) => {
    const manager = new IdentityManager();
    const identity = manager.generateRandomIdentity();
    console.log(`Generated identity:`);
    console.log(`  Alias: ${identity.alias}`);
    console.log(`  Name: ${identity.name}`);
    console.log(`  Email: ${identity.email}`);
    
    if (options.save) {
      manager.addIdentity(identity);
      console.log(`✓ Identity saved`);
    }
  });

// Commit Obfuscation Commands
const commit = program.command('commit').description('Create obfuscated commits');

commit
  .command('create')
  .description('Create a commit with obfuscated metadata')
  .requiredOption('-m, --message <message>', 'Commit message')
  .option('-r, --randomize-time', 'Randomize commit timestamp')
  .option('-o, --time-offset <ms>', 'Time offset in milliseconds', parseInt)
  .option('-a, --author <author>', 'Override author')
  .option('--allow-empty', 'Allow empty commit')
  .action((options) => {
    const obfuscator = new CommitObfuscator();
    obfuscator.createCommit({
      message: options.message,
      randomizeTime: options.randomizeTime,
      timeOffset: options.timeOffset,
      author: options.author,
      allowEmpty: options.allowEmpty
    });
    console.log('✓ Commit created');
  });

commit
  .command('amend')
  .description('Amend last commit with obfuscation')
  .option('-m, --message <message>', 'New commit message')
  .option('-r, --randomize-time', 'Randomize commit timestamp')
  .option('--no-edit', 'Keep existing message')
  .action((options) => {
    const obfuscator = new CommitObfuscator();
    obfuscator.amendCommit({
      message: options.message,
      randomizeTime: options.randomizeTime,
      noEdit: options.noEdit
    });
    console.log('✓ Commit amended');
  });

commit
  .command('sequence')
  .description('Create a sequence of commits')
  .argument('<messages...>', 'Commit messages')
  .option('-r, --randomize-time', 'Randomize timestamps')
  .option('-d, --delay <ms>', 'Delay between commits in ms', parseInt)
  .action((messages, options) => {
    const obfuscator = new CommitObfuscator();
    obfuscator.createCommitSequence(messages, {
      randomizeTime: options.randomizeTime,
      delayBetween: options.delay
    });
    console.log('✓ Commit sequence created');
  });

commit
  .command('noise')
  .description('Create a noise commit with random message')
  .action(() => {
    const obfuscator = new CommitObfuscator();
    obfuscator.obfuscateCommitPattern();
    console.log('✓ Noise commit created');
  });

// History Sanitization Commands
const history = program.command('history').description('Sanitize git history');

history
  .command('remove-file')
  .description('Remove a file from entire history')
  .argument('<path>', 'File path to remove')
  .action((path) => {
    const sanitizer = new HistorySanitizer();
    sanitizer.removeFileFromHistory(path);
    console.log('✓ File removed from history');
  });

history
  .command('remove-pattern')
  .description('Remove files matching pattern from history')
  .argument('<pattern>', 'File pattern (e.g., *.log)')
  .action((pattern) => {
    const sanitizer = new HistorySanitizer();
    sanitizer.removePatternFromHistory(pattern);
    console.log('✓ Pattern removed from history');
  });

history
  .command('rewrite-author')
  .description('Rewrite author information')
  .requiredOption('-o, --old-email <email>', 'Old email to replace')
  .requiredOption('-n, --new-name <name>', 'New name')
  .requiredOption('-e, --new-email <email>', 'New email')
  .action((options) => {
    const sanitizer = new HistorySanitizer();
    sanitizer.rewriteAuthor(options.oldEmail, options.newName, options.newEmail);
    console.log('✓ Author information rewritten');
  });

history
  .command('clean-branch')
  .description('Create a clean orphan branch')
  .argument('<source>', 'Source branch')
  .argument('<new>', 'New branch name')
  .option('-s, --start <commit>', 'Start point commit')
  .action((source, newBranch, options) => {
    const sanitizer = new HistorySanitizer();
    sanitizer.createCleanBranch(source, newBranch, options.start);
    console.log('✓ Clean branch created');
  });

// Secure Operations Commands
const secure = program.command('secure').description('Secure git operations');

secure
  .command('branch')
  .description('Create a secure branch with random name')
  .option('-b, --base <name>', 'Base name for branch')
  .action((options) => {
    const ops = new SecureOperations();
    const branchName = ops.createSecureBranch(options.base);
    console.log(`✓ Created secure branch: ${branchName}`);
  });

secure
  .command('remote')
  .description('Add an anonymous remote')
  .argument('<url>', 'Remote URL')
  .option('-a, --alias <alias>', 'Remote alias')
  .action((url, options) => {
    const ops = new SecureOperations();
    const remoteName = ops.createAnonymousRemote(url, options.alias);
    console.log(`✓ Added anonymous remote: ${remoteName}`);
  });

secure
  .command('push')
  .description('Push anonymously to remote')
  .argument('<remote>', 'Remote name')
  .argument('<branch>', 'Branch name')
  .option('-f, --force', 'Force push')
  .action((remote, branch, options) => {
    const ops = new SecureOperations();
    ops.pushAnonymously(remote, branch, options.force);
    console.log('✓ Pushed anonymously');
  });

secure
  .command('disable-reflog')
  .description('Disable and clear reflog')
  .action(() => {
    const ops = new SecureOperations();
    ops.disableReflog();
    console.log('✓ Reflog disabled and cleared');
  });

secure
  .command('obfuscate-branch')
  .description('Rename branch to random hash')
  .argument('<branch>', 'Branch to rename')
  .action((branch) => {
    const ops = new SecureOperations();
    const newName = ops.obfuscateBranchName(branch);
    console.log(`✓ Branch renamed to: ${newName}`);
  });

secure
  .command('list-dangling')
  .description('List dangling commits')
  .action(() => {
    const ops = new SecureOperations();
    const commits = ops.listDanglingCommits();
    if (commits.length === 0) {
      console.log('No dangling commits found');
    } else {
      console.log('Dangling commits:');
      commits.forEach(commit => console.log(`  ${commit}`));
    }
  });

secure
  .command('recover')
  .description('Recover a dangling commit')
  .argument('<hash>', 'Commit hash')
  .argument('<branch>', 'New branch name')
  .action((hash, branch) => {
    const ops = new SecureOperations();
    ops.recoverDanglingCommit(hash, branch);
    console.log(`✓ Recovered commit to branch: ${branch}`);
  });

program.parse();
