type ParsedCommand = {
  name: string;
  commandArgs: string[]
}

export class CommandParser {
  static parse(cliArgs: string[]): ParsedCommand[] {
    let currentCommand: ParsedCommand = { name: '', commandArgs: [] };
    const parsedCommands: ParsedCommand[] = [];

    for (const argument of cliArgs) {
      if (argument.startsWith('--')) {
        if (currentCommand.name.length > 0) {
          parsedCommands.push(currentCommand);
        }
        currentCommand = { name: argument, commandArgs: [] };
      } else if (currentCommand.name.length > 0 && argument) {
        currentCommand.commandArgs.push(argument);
      }
    }

    if (currentCommand.name.length > 0) {
      parsedCommands.push(currentCommand);
    }

    return parsedCommands;
  }
}
