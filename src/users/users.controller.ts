// src/users/users.controller.ts
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Register new user
  @Post('register')
  async register(@Body() body: { username: string; password: string; email: string }) {
    return this.usersService.createUser(body.username, body.password, body.email);
  }

  // Login and return JWT
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);
    return { message: 'Login successful', token };
  }

  // Get all users 
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }
}
