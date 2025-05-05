import { Command } from './command.interface.js';
const chalk = require('chalk');

export class HelpCommand implements Command {
  private readonly commandName: string = '--help';
  private readonly outputText: string = `Программа для подготовки данных для REST API сервера.

Пример: cli.js --<${chalk.green('command')}> [${chalk.red('--arguments')}]

Команды:

 ${chalk.red('--version')}:                   ${chalk.blue('# выводит номер версии')}
 ${chalk.red('--help')}:                      ${chalk.blue('# печатает этот текст')}
 ${chalk.red('--import')} <path>:             ${chalk.blue('# импортирует данные из TSV')}
 ${chalk.red('--generate')} <n> <path> <url>  ${chalk.blue('# генерирует произвольное количество тестовых данных')}`;

  public getName(): string {
    return this.commandName;
  }

  public async execute(): Promise<void> {
    console.log(this.outputText);
  }
}
