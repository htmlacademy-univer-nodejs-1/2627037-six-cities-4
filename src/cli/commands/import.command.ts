import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/index.js';
import { DefaultRentOfferService, RentOfferModel, RentOfferService } from '../../shared/modules/rent-offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Amenity, CityName, HousingType, RentOffer, UserType } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private rentOfferService: RentOfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.rentOfferService = new DefaultRentOfferService(this.logger, RentOfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = this.createOffer(line);
    await this.saveRentOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveRentOffer(rentOffer: RentOffer) {
    const user = await this.userService.findOrCreate({
      ...rentOffer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.rentOfferService.create({
      title: rentOffer.title,
      description: rentOffer.description,
      postDate: rentOffer.postDate,
      cityName: rentOffer.cityName,
      preview: rentOffer.preview,
      photos: rentOffer.photos,
      isPremium: rentOffer.isPremium,
      housingType: rentOffer.housingType,
      roomsCount: rentOffer.roomsCount,
      visitorsCount: rentOffer.visitorsCount,
      rentCost: rentOffer.rentCost,
      amenities: rentOffer.amenities,
      userId: user.id,
    });
  }

  private createOffer(offerData: string): RentOffer {
    const [
      title,
      description,
      createdDate,
      cityName,
      preview,
      photos,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomsCount,
      visitorsCount,
      rentCost,
      amenities,
      commentsCount,

      latitude,
      longitude,

      name,
      email,
      avatar,
      password,
      userType,
    ] = offerData.replace('\n', '').split('\t');

    const user = {
      name,
      email,
      avatar,
      password,
      userType: userType as UserType,
    };

    const cityCoordinates = {
      latitude: Number.parseInt(latitude, 10),
      longitude: Number.parseInt(longitude, 10),
    };

    return {
      title,
      description,
      postDate: new Date(createdDate),
      cityName: CityName[cityName as 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'],
      preview,
      photos: photos.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number.parseInt(rating, 10),
      housingType: housingType as HousingType,
      roomsCount: Number.parseInt(roomsCount, 10),
      visitorsCount: Number.parseInt(visitorsCount, 10),
      rentCost: Number.parseInt(rentCost, 10),
      amenities: amenities.split(';')
        .map((amenity) => amenity as Amenity),
      author: user,
      commentsCount: Number.parseInt(commentsCount, 10),
      cityCoordinates: cityCoordinates,
    };
  }
}
