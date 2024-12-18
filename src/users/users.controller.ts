import { Controller, Post, Body, Get, UseGuards, UnauthorizedException, Put, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);
    return { 
      message: 'Login successful', 
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    };
  }

  // Get all users (protected route)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  // Update user profile (protected route)
  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePicture')) 
  async updateProfile(
    @Req() req: any, 
    @Body() body: { username?: string; email?: string },
    @UploadedFile() profilePicture?: Express.Multer.File,
  ) {
    const userIdFromToken = req.user.sub;
    const base64Image = profilePicture ? profilePicture.buffer.toString('base64') : undefined;

    return this.usersService.updateUserProfile(userIdFromToken, body.username, body.email, base64Image);
  }
}
