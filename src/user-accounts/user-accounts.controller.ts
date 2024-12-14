import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { UserAccountsService } from './user-accounts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import the guard

@Controller('user-accounts')
export class UserAccountsController {
  constructor(private readonly userAccountsService: UserAccountsService) {}

  // Create a new user account
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createUserAccount(
    @Body() body: { account_name: string; balance: number },
    @Param('userId') userId: number, 
  ) {
    return this.userAccountsService.createUserAccount(userId, body.account_name, body.balance);
  }

  // Get all user accounts for the logged-in user
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserAccounts(@Param('userId') userId: number) {
    return this.userAccountsService.getUserAccounts(userId);
  }
}
