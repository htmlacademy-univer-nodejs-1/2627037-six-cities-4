import { readFileSync } from 'node:fs';
import { Command } from './command.interface.js';
import { resolve } from 'node:path';
import { JsonHelper } from '../shared/libs/json-helper.js';

export class VersionCommand implements Command {
  private readonly commandName: string = '--version';

  public constructor(
    private readonly readFromFilePath: string = './package.json'
  ) {}

  public getName(): string {
    return this.commandName;
  }

  public async execute(): Promise<void> {
    try {
      console.info(this.getVersion());
    } catch (error: unknown) {
      console.error(`Failed to read version from file ${this.readFromFilePath}.`);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  private getVersion() {
    const jsonString: string = readFileSync(resolve(this.readFromFilePath), 'utf-8');
    const jsonContent: unknown = JSON.parse(jsonString);
    if (!JsonHelper.isPackageJsonConfig(jsonContent)) {
      throw new Error(`Failed to parse json content from file ${this.readFromFilePath}.`);
    }
    return jsonContent.version;
  }
}
