import { BaseController } from './BaseController';
import { UserService } from '../Services/UserService';
class AuthControllerImpl extends BaseController {
    static instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!AuthControllerImpl.instance) {
            AuthControllerImpl.instance = new AuthControllerImpl();
        }
        return AuthControllerImpl.instance;
    }
    async register(req, res) {
        const { username, password, email, role, name } = req.body;
        if (!username || !password || !email || !role || !name) {
            this.sendBadRequest(res, 'Missing required parameters: username, password, email, role, and name');
            return;
        }
        try {
            const userId = await UserService.registerUser(req.body, req.ip || '');
            this.sendSuccess(res, { userId }, 'User registered successfully', 201);
        }
        catch (error) {
            this.sendError(res, error.message, 400);
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            this.sendBadRequest(res, 'Missing email or password');
            return;
        }
        try {
            const data = await UserService.loginUser(req.body, req.ip || '');
            this.sendSuccess(res, data, 'Login successful');
        }
        catch (error) {
            this.sendUnauthorized(res, error.message);
        }
    }
}
const authControllerInstance = AuthControllerImpl.getInstance();
export const AuthControllerWrapper = {
    register: (req, res) => authControllerInstance.register(req, res),
    login: (req, res) => authControllerInstance.login(req, res)
};
export { AuthControllerWrapper as AuthController };
