/**
 * Standardized API Response Envelope
 */
export class ApiResponse {
  constructor(res, statusCode = 200, message = 'Success', data = null, meta = null) {
    return res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300,
      message,
      data,
      ...(meta && { meta })
    });
  }
}
