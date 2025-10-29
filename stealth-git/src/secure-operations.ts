import { execSync } from 'child_process';
import { randomBytes } from 'crypto';

export class SecureOperations {
  createSecureBranch(baseName?: string): string {
    const randomSuffix = randomBytes(4).toString('hex');
    const branchName = baseName ? `${baseName}-${randomSuffix}` : `secure-${randomSuffix}`;
    
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    return branchName;
  }

  createAnonymousRemote(url: string, alias?: string): string {
    const remoteName = alias || `anon-${randomBytes(4).toString('hex')}`;
    execSync(`git remote add ${remoteName} ${url}`, { stdio: 'inherit' });
    return remoteName;
  }

  pushAnonymously(remote: string, branch: string, force: boolean = false): void {
    const forceFlag = force ? '--force' : '';
    execSync(`git push ${remote} ${branch} ${forceFlag}`, { stdio: 'inherit' });
  }

  createDetachedCommit(message: string): string {
    execSync('git checkout --detach', { stdio: 'inherit' });
    execSync(`git commit --allow-empty -m "${message}"`, { stdio: 'inherit' });
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    return commitHash;
  }

  stashWithEncryption(message?: string): void {
    const stashMessage = message || `encrypted-${Date.now()}`;
    execSync(`git stash push -m "${stashMessage}"`, { stdio: 'inherit' });
  }

  createSignedCommit(message: string, keyId?: string): void {
    let cmd = `git commit -S`;
    if (keyId) {
      cmd += ` --gpg-sign=${keyId}`;
    }
    cmd += ` -m "${message}"`;
    execSync(cmd, { stdio: 'inherit' });
  }

  verifyCommitSignatures(range?: string): void {
    const rangeArg = range || 'HEAD';
    execSync(`git verify-commit ${rangeArg}`, { stdio: 'inherit' });
  }

  createShallowClone(url: string, depth: number = 1, targetDir?: string): void {
    const dir = targetDir || '.';
    execSync(`git clone --depth ${depth} ${url} ${dir}`, { stdio: 'inherit' });
  }

  removeRemoteTracking(): void {
    const remotes = execSync('git remote', { encoding: 'utf-8' }).trim().split('\n');
    remotes.forEach(remote => {
      if (remote) {
        execSync(`git remote remove ${remote}`, { stdio: 'inherit' });
      }
    });
  }

  createBareRepository(path: string): void {
    execSync(`git init --bare ${path}`, { stdio: 'inherit' });
  }

  enableReflog(enable: boolean = true): void {
    const value = enable ? 'true' : 'false';
    execSync(`git config core.logAllRefUpdates ${value}`, { stdio: 'inherit' });
  }

  disableReflog(): void {
    this.enableReflog(false);
    execSync('git reflog expire --expire=now --all', { stdio: 'inherit' });
    execSync('git gc --prune=now', { stdio: 'inherit' });
  }

  createWorktree(path: string, branch?: string): void {
    const branchArg = branch ? `-b ${branch}` : '';
    execSync(`git worktree add ${branchArg} ${path}`, { stdio: 'inherit' });
  }

  obfuscateBranchName(originalName: string): string {
    const hash = randomBytes(8).toString('hex');
    const newName = `${hash.substring(0, 8)}`;
    
    try {
      execSync(`git branch -m ${originalName} ${newName}`, { stdio: 'inherit' });
      return newName;
    } catch (error) {
      throw new Error(`Failed to rename branch: ${error}`);
    }
  }

  createMirrorPush(remote: string, force: boolean = false): void {
    const forceFlag = force ? '--force' : '';
    execSync(`git push ${remote} --mirror ${forceFlag}`, { stdio: 'inherit' });
  }

  pruneRemoteBranches(remote: string): void {
    execSync(`git remote prune ${remote}`, { stdio: 'inherit' });
  }

  listDanglingCommits(): string[] {
    const output = execSync('git fsck --lost-found --no-reflogs', { encoding: 'utf-8' });
    const commits = output
      .split('\n')
      .filter(line => line.includes('dangling commit'))
      .map(line => line.split(' ').pop() || '');
    return commits;
  }

  recoverDanglingCommit(commitHash: string, branchName: string): void {
    execSync(`git branch ${branchName} ${commitHash}`, { stdio: 'inherit' });
  }
}
