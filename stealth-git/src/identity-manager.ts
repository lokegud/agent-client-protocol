import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface Identity {
  name: string;
  email: string;
  signingKey?: string;
  alias: string;
}

export class IdentityManager {
  private identitiesFile: string;
  private identities: Map<string, Identity>;

  constructor(customPath?: string) {
    this.identitiesFile = customPath || join(homedir(), '.stealth-identities.json');
    this.identities = new Map();
    this.load();
  }

  private load(): void {
    if (existsSync(this.identitiesFile)) {
      const data = JSON.parse(readFileSync(this.identitiesFile, 'utf-8'));
      this.identities = new Map(Object.entries(data));
    }
  }

  private save(): void {
    const data = Object.fromEntries(this.identities);
    writeFileSync(this.identitiesFile, JSON.stringify(data, null, 2));
  }

  addIdentity(identity: Identity): void {
    this.identities.set(identity.alias, identity);
    this.save();
  }

  removeIdentity(alias: string): boolean {
    const result = this.identities.delete(alias);
    if (result) this.save();
    return result;
  }

  getIdentity(alias: string): Identity | undefined {
    return this.identities.get(alias);
  }

  listIdentities(): Identity[] {
    return Array.from(this.identities.values());
  }

  switchIdentity(alias: string, scope: 'global' | 'local' = 'local'): void {
    const identity = this.getIdentity(alias);
    if (!identity) {
      throw new Error(`Identity '${alias}' not found`);
    }

    const scopeFlag = scope === 'global' ? '--global' : '--local';

    execSync(`git config ${scopeFlag} user.name "${identity.name}"`, { stdio: 'inherit' });
    execSync(`git config ${scopeFlag} user.email "${identity.email}"`, { stdio: 'inherit' });

    if (identity.signingKey) {
      execSync(`git config ${scopeFlag} user.signingkey "${identity.signingKey}"`, { stdio: 'inherit' });
      execSync(`git config ${scopeFlag} commit.gpgsign true`, { stdio: 'inherit' });
    }
  }

  getCurrentIdentity(): { name: string; email: string } {
    try {
      const name = execSync('git config user.name', { encoding: 'utf-8' }).trim();
      const email = execSync('git config user.email', { encoding: 'utf-8' }).trim();
      return { name, email };
    } catch {
      return { name: 'unknown', email: 'unknown' };
    }
  }

  generateRandomIdentity(): Identity {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const domains = ['protonmail.com', 'tutanota.com', 'mailbox.org', 'posteo.net'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomNum = Math.floor(Math.random() * 9999);

    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`,
      alias: `random-${Date.now()}`
    };
  }
}
