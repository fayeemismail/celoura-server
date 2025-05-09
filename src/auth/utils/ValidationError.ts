// utils/ValidationError.ts
export class ValidationError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode = 400) {
      super(message);
      this.name = "ValidationError";
      this.statusCode = statusCode;
    }
  }
  