import { Response } from 'express';

export class BaseController {
  protected sendSuccess(res: Response, data: any = null, message: string = 'Success', statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  protected sendError(res: Response, error: string = 'Internal Server Error', statusCode: number = 500): void {
    res.status(statusCode).json({
      success: false,
      message: error
    });
  }

  protected sendNotFound(res: Response, message: string = 'Resource not found'): void {
    this.sendError(res, message, 404);
  }

  protected sendBadRequest(res: Response, message: string = 'Bad request'): void {
    this.sendError(res, message, 400);
  }

  protected sendUnauthorized(res: Response, message: string = 'Unauthorized'): void {
    this.sendError(res, message, 401);
  }

  protected sendForbidden(res: Response, message: string = 'Forbidden'): void {
    this.sendError(res, message, 403);
  }
}
