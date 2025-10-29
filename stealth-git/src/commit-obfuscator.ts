import { execSync } from 'child_process';

export interface CommitOptions {
  message: string;
  randomizeTime?: boolean;
  timeOffset?: number;
  author?: string;
  coAuthors?: string[];
  allowEmpty?: boolean;
}

export class CommitObfuscator {
  private getRandomTimeOffset(): number {
    const hoursInMs = 3600000;
    const daysInMs = 86400000;
    const minOffset = -7 * daysInMs;
    const maxOffset = 0;
    return Math.floor(Math.random() * (maxOffset - minOffset) + minOffset);
  }

  private getRandomTimeWithinDay(baseDate: Date): Date {
    const date = new Date(baseDate);
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    date.setHours(hour, minute, second, 0);
    return date;
  }

  createCommit(options: CommitOptions): void {
    let commitDate: Date;

    if (options.randomizeTime) {
      const offset = options.timeOffset || this.getRandomTimeOffset();
      commitDate = new Date(Date.now() + offset);
      commitDate = this.getRandomTimeWithinDay(commitDate);
    } else if (options.timeOffset) {
      commitDate = new Date(Date.now() + options.timeOffset);
    } else {
      commitDate = new Date();
    }

    const dateString = commitDate.toISOString();
    
    let message = options.message;
    if (options.coAuthors && options.coAuthors.length > 0) {
      message += '\n\n';
      options.coAuthors.forEach(coAuthor => {
        message += `Co-authored-by: ${coAuthor}\n`;
      });
    }

    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: dateString,
      GIT_COMMITTER_DATE: dateString
    };

    let cmd = 'git commit';
    if (options.allowEmpty) {
      cmd += ' --allow-empty';
    }
    if (options.author) {
      cmd += ` --author="${options.author}"`;
    }
    cmd += ` -m "${message.replace(/"/g, '\\"')}"`;

    execSync(cmd, { env, stdio: 'inherit' });
  }

  amendCommit(options: { message?: string; randomizeTime?: boolean; noEdit?: boolean }): void {
    let cmd = 'git commit --amend';
    
    if (options.noEdit) {
      cmd += ' --no-edit';
    } else if (options.message) {
      cmd += ` -m "${options.message.replace(/"/g, '\\"')}"`;
    }

    if (options.randomizeTime) {
      const offset = this.getRandomTimeOffset();
      const commitDate = this.getRandomTimeWithinDay(new Date(Date.now() + offset));
      const dateString = commitDate.toISOString();
      
      const env = {
        ...process.env,
        GIT_AUTHOR_DATE: dateString,
        GIT_COMMITTER_DATE: dateString
      };

      execSync(cmd, { env, stdio: 'inherit' });
    } else {
      execSync(cmd, { stdio: 'inherit' });
    }
  }

  createCommitSequence(messages: string[], options: { randomizeTime?: boolean; delayBetween?: number } = {}): void {
    messages.forEach((message, index) => {
      this.createCommit({
        message,
        randomizeTime: options.randomizeTime,
        allowEmpty: true
      });

      if (options.delayBetween && index < messages.length - 1) {
        const delay = options.delayBetween + Math.random() * 1000;
        execSync(`sleep ${delay / 1000}`, { stdio: 'inherit' });
      }
    });
  }

  obfuscateCommitPattern(): void {
    const patterns = [
      'Update dependencies',
      'Fix typo',
      'Refactor code',
      'Update documentation',
      'Clean up',
      'Minor improvements',
      'Code review changes',
      'Update tests'
    ];

    const message = patterns[Math.floor(Math.random() * patterns.length)];
    this.createCommit({
      message,
      randomizeTime: true,
      allowEmpty: true
    });
  }
}
