export const CreateRentOfferValidationMessage = {
  title: {
    minLength: 'min length is 10',
    maxLength: 'max length is 100',
  },
  description: {
    minLength: 'min length is 20',
    maxLength: 'max length is 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be valid date',
  },
  cityName: {
    invalidFormat: 'cityName must be valid CityName enum value',
  },
  preview: {
    invalidFormat: 'preview must be valid format',
  },
  photos: {
    invalidFormat: 'photos must be of array type',
    minLength: 'array length must be equal to 6',
    maxLength: 'array length must be equal to 6',
  },
  isPremium: {
    invalidFormat: 'isPremium must be of boolean type',
  },
  housingType: {
    invalidFormat: 'housingType must be valid HousingType enum value',
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be of integer type',
    minValue: 'min value is 1',
    maxValue: 'max value is 8',
  },
  visitorsCount: {
    invalidFormat: 'visitorsCount must be of integer type',
    minValue: 'min value is 1',
    maxValue: 'max value is 10',
  },
  rentCost: {
    invalidFormat: 'rentCost must be of integer type',
    minValue: 'min value is 100',
    maxValue: 'max value is 100000',
  },
  amenities: {
    invalidFormat: 'amenities must be of array type',
    invalidContent: 'array must contain only Amenity enum values'
  },
  userId: {
    invalidFormat: 'userId is required',
    invalidId: 'userId field must be a valid id',
  },
} as const;
