import { CommandParser } from './command-parser.js';
import { Command } from './command.interface.js';
import { HelpCommand } from './help.command.js';

type CommandWithName = {
  name: string;
  command: Command;
}

export class CLIApplication {
  private registeredCommands: CommandWithName[] = [];

  public constructor(
    private readonly defaultCommand: CommandWithName = { name: '--help', command: new HelpCommand() }
  ) {}

  public registerCommands(commands: Command[]): void {
    commands.forEach((command) => {
      const commandName = command.getName();
      if (this.registeredCommands.filter((registered) => registered.name === commandName).length > 0) {
        throw new Error(`Command with name ${commandName} is already registered.`);
      }
      this.registeredCommands.push({ name: commandName, command: command });
    });
  }

  public getCommand(name: string): Command {
    const foundCommands = this.registeredCommands.filter((command) => command.name === name);
    return foundCommands.length === 0 ? this.getDefaultCommand() : foundCommands[0].command;
  }

  public getDefaultCommand(): Command | never {
    const foundCommands = this.registeredCommands.filter((command) => command.name === this.defaultCommand.name);
    if (foundCommands.length === 0) {
      throw new Error(`Default command with name "${this.defaultCommand.name}" is not registered.`);
    }
    return foundCommands[0].command;
  }

  public processCommandLineArgs(args: string[]): void {
    const parsedCommands = CommandParser.parse(args);
    const command = this.getCommand(parsedCommands.length > 0 ? parsedCommands[0].name : '');
    const commandArgs = parsedCommands.length > 0 ? parsedCommands[0].commandArgs : [];
    command.execute(...commandArgs);
  }
}
