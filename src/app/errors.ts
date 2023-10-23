export class AppError implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = "AppError";
    this.message = message;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
