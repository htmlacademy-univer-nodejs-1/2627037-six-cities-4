export class ValidationError extends Error {
  public property: string;
  public value: string;
  public messages: string[];

  constructor(property: string, value: string, messages: string[], errorMessage: string) {
    super(errorMessage);

    this.property = property;
    this.value = value;
    this.messages = messages;
  }
}
