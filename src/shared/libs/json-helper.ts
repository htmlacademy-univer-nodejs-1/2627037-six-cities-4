type PackageJsonConfig = {
  version: string;
}

export class JsonHelper {
  public static isPackageJsonConfig(value: unknown): value is PackageJsonConfig {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.hasOwn(value, 'version');
  }
}
