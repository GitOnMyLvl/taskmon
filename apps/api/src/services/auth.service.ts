import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { User, AuthRequest, RegisterRequest, JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a password with its hash
   */
  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      console.log('🔍 Comparing password...');
      console.log('Password length:', password.length);
      console.log('Hash length:', hash.length);
      console.log('Hash starts with:', hash.substring(0, 10));

      const result = await bcrypt.compare(password, hash);
      console.log('bcrypt.compare result:', result);
      return result;
    } catch (error) {
      console.error('❌ bcrypt.compare error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT token for a user
   */
  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Register a new user
   */
  static async register(
    data: RegisterRequest
  ): Promise<Omit<User, 'passwordHash'>> {
    const { email, password, displayName } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
      },
    });

    // Create monster for the user
    await prisma.monster.create({
      data: {
        ownerId: user.id,
        species: 'slime',
        stage: 1,
        xp: 0,
        hunger: 100,
        mood: 'happy',
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login user
   */
  static async login(data: AuthRequest): Promise<Omit<User, 'passwordHash'>> {
    try {
      const { email, password } = data;
      console.log('🔍 Attempting login for email:', email);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log('❌ User not found:', email);
        throw new Error('Invalid credentials');
      }

      console.log('✅ User found:', email);

      // Verify password
      console.log('🔍 Verifying password...');
      const isValidPassword = await this.comparePassword(
        password,
        user.passwordHash
      );
      console.log('Password valid:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', email);
        throw new Error('Invalid credentials');
      }

      console.log('✅ Password verified for user:', email);

      // Update streak and get updated user data
      const newStreak = await this.updateLoginStreak(user.id);
      console.log(
        '🔥 Updated streak for user:',
        email,
        'New streak:',
        newStreak
      );

      // Get updated user data
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!updatedUser) {
        throw new Error('Failed to get updated user data');
      }

      const { passwordHash: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(
    userId: string
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Calculate and update user streak on login
   */
  static async updateLoginStreak(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastLoginAt: true, streak: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const lastLogin = new Date(user.lastLoginAt);

    // Reset time to midnight for date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLoginDate = new Date(
      lastLogin.getFullYear(),
      lastLogin.getMonth(),
      lastLogin.getDate()
    );

    // Calculate days difference
    const daysDiff = Math.floor(
      (today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = user.streak;

    if (daysDiff === 0) {
      // Same day login, keep current streak
      newStreak = user.streak;
    } else if (daysDiff === 1) {
      // Consecutive day login, increment streak
      newStreak = user.streak + 1;
    } else {
      // Gap in login, reset streak to 1
      newStreak = 1;
    }

    // Update user with new streak and last login time
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        lastLoginAt: now,
      },
    });

    return newStreak;
  }

  /**
   * Update user streak
   */
  static async updateStreak(userId: string, newStreak: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { streak: newStreak },
    });
  }
}
