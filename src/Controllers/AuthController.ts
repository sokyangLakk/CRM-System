import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../Services/UserService';

class AuthControllerImpl extends BaseController {
  private static instance: AuthControllerImpl;

  private constructor() {
    super();
  }

  public static getInstance(): AuthControllerImpl {
    if (!AuthControllerImpl.instance) {
      AuthControllerImpl.instance = new AuthControllerImpl();
    }
    return AuthControllerImpl.instance;
  }

  public async register(req: Request, res: Response): Promise<void> {
    const { username, password, email, role, name } = req.body;

    if (!username || !password || !email || !role || !name) {
      this.sendBadRequest(res, 'Missing required parameters: username, password, email, role, and name');
      return;
    }

    try {
      const userId = await UserService.registerUser(req.body, req.ip || '');
      this.sendSuccess(res, { userId }, 'User registered successfully', 201);
    } catch (error: any) {
      this.sendError(res, error.message, 400);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      this.sendBadRequest(res, 'Missing email or password');
      return;
    }

    try {
      const data = await UserService.loginUser(req.body, req.ip || '');
      this.sendSuccess(res, data, 'Login successful');
    } catch (error: any) {
      this.sendUnauthorized(res, error.message);
    }
  }
}

const authControllerInstance = AuthControllerImpl.getInstance();
export const AuthControllerWrapper = {
  register: (req: Request, res: Response) => authControllerInstance.register(req, res),
  login: (req: Request, res: Response) => authControllerInstance.login(req, res)
};
export { AuthControllerWrapper as AuthController };
