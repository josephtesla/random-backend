class AppError extends Error {
  statusCode: number | string;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: string | number) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
