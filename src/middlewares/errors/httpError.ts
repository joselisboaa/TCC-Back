export class HttpsError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.statusCode = statusCode;
  
      Object.setPrototypeOf(this, HttpsError.prototype);
    }
}