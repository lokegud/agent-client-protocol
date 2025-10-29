import { execSync } from 'child_process';

export interface SanitizeOptions {
  removeFiles?: string[];
  removePatterns?: string[];
  rewriteAuthor?: { oldEmail: string; newName: string; newEmail: string };
  squashCommits?: { from: string; to: string; message: string };
}

export class HistorySanitizer {
  removeFileFromHistory(filePath: string): void {
    console.log(`Removing ${filePath} from git history...`);
    execSync(`git filter-branch --force --index-filter \
      "git rm --cached --ignore-unmatch ${filePath}" \
      --prune-empty --tag-name-filter cat -- --all`, { stdio: 'inherit' });
    
    console.log('Cleaning up refs...');
    execSync('git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d', { stdio: 'inherit' });
    execSync('git reflog expire --expire=now --all', { stdio: 'inherit' });
    execSync('git gc --prune=now --aggressive', { stdio: 'inherit' });
  }

  removePatternFromHistory(pattern: string): void {
    console.log(`Removing pattern "${pattern}" from git history...`);
    execSync(`git filter-branch --force --tree-filter \
      "find . -type f -name '${pattern}' -delete" \
      --prune-empty --tag-name-filter cat -- --all`, { stdio: 'inherit' });
    
    this.cleanupRefs();
  }

  rewriteAuthor(oldEmail: string, newName: string, newEmail: string): void {
    console.log(`Rewriting author from ${oldEmail} to ${newName} <${newEmail}>...`);
    
    const script = `
      if [ "$GIT_COMMITTER_EMAIL" = "${oldEmail}" ]; then
        export GIT_COMMITTER_NAME="${newName}"
        export GIT_COMMITTER_EMAIL="${newEmail}"
      fi
      if [ "$GIT_AUTHOR_EMAIL" = "${oldEmail}" ]; then
        export GIT_AUTHOR_NAME="${newName}"
        export GIT_AUTHOR_EMAIL="${newEmail}"
      fi
    `;

    execSync(`git filter-branch --force --env-filter '${script}' --tag-name-filter cat -- --all`, { stdio: 'inherit' });
    this.cleanupRefs();
  }

  squashCommits(from: string, to: string, message: string): void {
    console.log(`Squashing commits from ${from} to ${to}...`);
    execSync(`git reset --soft ${from}`, { stdio: 'inherit' });
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  }

  rewriteCommitDates(startDate: Date, endDate: Date, randomize: boolean = true): void {
    console.log('Rewriting commit dates...');
    
    const commits = execSync('git rev-list --all --reverse', { encoding: 'utf-8' })
      .trim()
      .split('\n');

    const timeSpan = endDate.getTime() - startDate.getTime();
    const interval = timeSpan / commits.length;

    commits.forEach((commit, index) => {
      let commitDate: Date;
      if (randomize) {
        const baseTime = startDate.getTime() + (interval * index);
        const randomOffset = (Math.random() - 0.5) * interval * 0.5;
        commitDate = new Date(baseTime + randomOffset);
      } else {
        commitDate = new Date(startDate.getTime() + (interval * index));
      }

      const dateString = commitDate.toISOString();
      const env = {
        ...process.env,
        GIT_AUTHOR_DATE: dateString,
        GIT_COMMITTER_DATE: dateString
      };

      execSync(`git commit --amend --no-edit --date="${dateString}"`, { env, stdio: 'inherit' });
    });
  }

  removeCommitsByAuthor(authorEmail: string): void {
    console.log(`Removing all commits by ${authorEmail}...`);
    
    const script = `
      if [ "$GIT_AUTHOR_EMAIL" = "${authorEmail}" ]; then
        skip_commit "$@"
      else
        git commit-tree "$@"
      fi
    `;

    execSync(`git filter-branch --force --commit-filter '${script}' --tag-name-filter cat -- --all`, { stdio: 'inherit' });
    this.cleanupRefs();
  }

  sanitizeCommitMessages(pattern: RegExp, replacement: string): void {
    console.log('Sanitizing commit messages...');
    
    const script = `
      git commit-tree "$@" < <(
        git cat-file commit $GIT_COMMIT | 
        sed '1,/^$/d' | 
        sed 's/${pattern.source}/${replacement}/g'
      )
    `;

    execSync(`git filter-branch --force --msg-filter '${script}' --tag-name-filter cat -- --all`, { stdio: 'inherit' });
    this.cleanupRefs();
  }

  private cleanupRefs(): void {
    console.log('Cleaning up refs...');
    try {
      execSync('git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d', { stdio: 'inherit' });
    } catch {
      // Refs might not exist
    }
    execSync('git reflog expire --expire=now --all', { stdio: 'inherit' });
    execSync('git gc --prune=now --aggressive', { stdio: 'inherit' });
  }

  createCleanBranch(sourceBranch: string, newBranch: string, startPoint?: string): void {
    console.log(`Creating clean branch ${newBranch} from ${sourceBranch}...`);
    
    if (startPoint) {
      execSync(`git checkout -b ${newBranch} ${startPoint}`, { stdio: 'inherit' });
    } else {
      execSync(`git checkout --orphan ${newBranch}`, { stdio: 'inherit' });
      execSync('git rm -rf .', { stdio: 'inherit' });
    }
  }

  exportCleanHistory(outputDir: string): void {
    console.log(`Exporting clean history to ${outputDir}...`);
    execSync(`git clone --mirror . ${outputDir}`, { stdio: 'inherit' });
  }
}
