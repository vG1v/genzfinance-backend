import { Controller, Post, Body, Get, UseGuards, UnauthorizedException, Put, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from '../auth/auth.module'; 

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
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
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.saveRefreshToken(user.id, refreshToken);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    };
  }

  // Refresh token endpoint
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      const decoded = this.jwtService.verify(body.refreshToken);
      const userId = decoded.sub;

      const isValid = await this.usersService.validateAndClearRefreshToken(userId, body.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { email: decoded.email, sub: userId };
      const accessToken = this.jwtService.sign(payload);
      const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.usersService.saveRefreshToken(userId, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
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

  // Logout endpoint
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const userIdFromToken = req.user.sub;
    const accessToken = req.headers.authorization?.split(' ')[1];

    // Clear the refresh token from the database
    await this.usersService.clearRefreshToken(userIdFromToken);

    // Blacklist the access token
    this.tokenBlacklistService.addTokenToBlacklist(accessToken);

    return { message: 'Logout successful' };
  }
}
