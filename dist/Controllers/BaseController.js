export class BaseController {
    sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    sendError(res, error = 'Internal Server Error', statusCode = 500) {
        res.status(statusCode).json({
            success: false,
            message: error
        });
    }
    sendNotFound(res, message = 'Resource not found') {
        this.sendError(res, message, 404);
    }
    sendBadRequest(res, message = 'Bad request') {
        this.sendError(res, message, 400);
    }
    sendUnauthorized(res, message = 'Unauthorized') {
        this.sendError(res, message, 401);
    }
    sendForbidden(res, message = 'Forbidden') {
        this.sendError(res, message, 403);
    }
}
