import { CityCoordinates, CityName } from '../types/index.js';

export function getCityCoordinates(cityName: CityName): CityCoordinates {
  switch(cityName) {
    case CityName.Amsterdam:
      return { latitude: 52.370216, longitude: 4.895168 };
    case CityName.Cologne:
      return { latitude: 50.938361, longitude: 6.959974 };
    case CityName.Paris:
      return { latitude: 48.85661, longitude: 2.351499 };
    case CityName.Hamburg:
      return { latitude: 53.550341, longitude: 10.000654 };
    case CityName.Dusseldorf:
      return { latitude: 51.225402, longitude: 6.776314 };
    case CityName.Brussels:
      return { latitude: 50.846557, longitude: 4.351697 };
  }
}
