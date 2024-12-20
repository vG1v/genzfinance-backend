import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // Create a new user
  async createUser(username: string, password: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashedPassword, email });
    return this.userRepository.save(user);
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // Save a new refresh token
  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.setRefreshToken(refreshToken);
    await this.userRepository.save(user);
  }

  // Validate refresh token and remove it if valid
  async validateAndClearRefreshToken(userId: number, token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = user.refreshToken && (await bcrypt.compare(token, user.refreshToken));
    if (isValid) {
      // Clear the old refresh token
      user.refreshToken = null;
      await this.userRepository.save(user);
    }
    return isValid;
  }

  // Find all users
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Update user profile (only authenticated user can update their own data)
  async updateUserProfile(
    userIdFromToken: number,
    username?: string,
    email?: string,
    profilePicture?: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userIdFromToken } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for username or email conflicts (ensure the update is not conflicting with other users)
    if (email || username) {
      const conflictingUser = await this.userRepository.findOne({
        where: [{ email }, { username }],
      });
      if (conflictingUser && conflictingUser.id !== userIdFromToken) {
        throw new ConflictException('Email or username already in use');
      }
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    return this.userRepository.save(user);
  }

  // Clear the refresh token for a user
  async clearRefreshToken(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.refreshToken = null;
    await this.userRepository.save(user);
  }

}