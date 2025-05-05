import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<${chalk.green('command')}> [${chalk.red('--arguments')}]
        Команды:
            ${chalk.red('--version')}:                   ${chalk.blue('# выводит номер версии')}
            ${chalk.red('--help')}:                      ${chalk.blue('# печатает этот текст')}
            ${chalk.red('--import')} <path>:             ${chalk.blue('# импортирует данные из TSV')}
            ${chalk.red('--generate')} <n> <path> <url>  ${chalk.blue('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
