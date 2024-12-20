import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ensure the user is authenticated
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    // Create a new transaction (protected route)
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createTransaction(
        @Body() body: { userAccountId: number; amount: number; type: 'income' | 'expense'; name?: string },
        @Param('userId') userId: number,
    ) {
        return this.transactionsService.createTransaction(
            userId,
            body.userAccountId,
            body.amount,
            body.type,
            body.name,
        );
    }

    // Get all transactions for a user (protected route)
    @Get('user/:userId')
    @UseGuards(JwtAuthGuard)
    async getTransactionsByUserId(@Param('userId') userId: number) {
        return this.transactionsService.getTransactionsByUserId(userId);
    }

    // Get all transactions for a specific user account (protected route)
    @Get('account/:accountId')
    @UseGuards(JwtAuthGuard)
    async getTransactionsByAccountId(@Param('accountId') accountId: number) {
        return this.transactionsService.getTransactionsByAccountId(accountId);
    }
}
