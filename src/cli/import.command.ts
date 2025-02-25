import { TSVFileReader } from '../shared/libs/tsv-file-reader.js';
import { RentOffer } from '../shared/types/rent-offer.type.js';
import { Command } from './command.interface.js';
const chalk = require('chalk');

export class ImportCommand implements Command {
  private readonly commandName: string = '--import';

  public constructor(
    private readFromFilePath: string = './mocks/offer-data.tsv'
  ) {}

  public getName(): string {
    return this.commandName;
  }

  public async execute(...parameters: string[]): Promise<void> {
    try {
      if (parameters.length > 0) {
        this.readFromFilePath = parameters[0];
      }
      console.info(this.importFromTSV());
    } catch (error: unknown) {
      console.error(`Failed to read data from file ${this.readFromFilePath}.`);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  private importFromTSV(): string {
    const fileReader = new TSVFileReader(this.readFromFilePath);
    fileReader.read();
    const parsedOfferData: RentOffer[] = fileReader.convertToRentOfferArray();

    let result = '';
    for (let i = 1; i < parsedOfferData.length + 1; i++) {
      result += chalk.ansi256(i % 256)(JSON.stringify(parsedOfferData[i - 1], null, 2));
      result += '\n\n';
    }
    return result;
  }
}
