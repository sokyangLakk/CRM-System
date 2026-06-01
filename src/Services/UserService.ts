import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { StudentRepository } from '../repositories/StudentRepository';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { JWT_SECRET } from '../middlewares/AuthMiddleware';

export class UserService {
  static async registerUser(data: any, ipAddress: string): Promise<any> {
    const { username, password, email, role, name, studentNumber, department, phone } = data;

    // Check if user exists
    const existingUser = await UserRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const existingEmail = await UserRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email is already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create main user record
    const userId = await UserRepository.create({
      username,
      password: hashedPassword,
      email,
      role
    });

    // Create profile based on role
    if (role === 'teacher') {
      await TeacherRepository.create({
        user_id: userId,
        name,
        department,
        email,
        phone
      });
    } else if (role === 'student') {
      if (!studentNumber) {
        throw new Error('Student number is required for students');
      }
      await StudentRepository.create({
        user_id: userId,
        name,
        student_number: studentNumber,
        email,
        phone,
        status: 'active'
      });
    }

    // Log activity
    await ActivityLogRepository.create({
      user_id: userId,
      action: 'REGISTER',
      description: `Successfully registered new account for ${username} with role ${role}`,
      ip_address: ipAddress
    });

    return userId;
  }

  static async loginUser(data: any, ipAddress: string): Promise<any> {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error('Missing email or password');
    }

    const user = await UserRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Get additional info based on role
    let profile = null;
    if (user.role === 'teacher') {
      profile = await TeacherRepository.findByUserId(user.id!);
    } else if (user.role === 'student') {
      profile = await StudentRepository.findByUserId(user.id!);
    }

    // Log activity
    await ActivityLogRepository.create({
      user_id: user.id,
      action: 'LOGIN',
      description: `Successfully logged in. Role: ${user.role}`,
      ip_address: ipAddress
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile
      }
    };
  }
}
