export const CreateOfferCommentValidationMessage = {
  offerId: {
    invalidFormat: 'offerId is required',
    invalidId: 'offerId field must be a valid id',
  },
  userId: {
    invalidFormat: 'userId is required',
    invalidId: 'userId field must be a valid id',
  },
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 5, max is 1024',
  },
  rating: {
    invalidFormat: 'rating must be of integer type',
    minValue: 'min value is 1',
    maxValue: 'max value is 5',
  }
};
