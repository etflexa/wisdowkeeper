class AppError extends Error {
  statusCode;

  constructor(message, statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

async function appErrorMiddleware(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
}

export { AppError, appErrorMiddleware };
