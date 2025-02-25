export class ValuesParser {
  public static parseStringBoolean(value: string): boolean {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        throw new Error(`Invalid boolean value. Value: ${value}.`);
    }
  }
}
