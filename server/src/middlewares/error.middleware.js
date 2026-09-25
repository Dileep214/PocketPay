export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let details = err.details || [];

  // Mongoose duplicate key error (e.g., duplicate phone or application)
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyValue || {})[0];
    if (field === 'phone') {
      message = 'An account with this phone number already exists.';
    } else if (err.keyPattern && err.keyPattern.jobId && err.keyPattern.workerId) {
      message = 'You have already applied to this job.';
    } else {
      message = `Duplicate value entered for ${field}.`;
    }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    message = 'Validation failed for request data.';
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid format for resource ID: ${err.value}`;
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[UNHANDLED SERVER ERROR]:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: details.length > 0 ? details : undefined
    }
  });
};
