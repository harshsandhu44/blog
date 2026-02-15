export class ContentValidationError extends Error {
  public readonly filePath?: string;

  constructor(message: string, filePath?: string) {
    super(message);
    this.name = "ContentValidationError";
    this.filePath = filePath;
  }
}
