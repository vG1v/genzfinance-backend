import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { UserAccount } from '../user-accounts/user-account.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(UserAccount)
        private readonly userAccountRepository: Repository<UserAccount>,
    ) { }

    // Create a new transaction
    async createTransaction(
        userId: number, 
        userAccountId: number,
        amount: number,
        type: 'income' | 'expense',
        name?: string,
    ): Promise<Transaction> {
        const userAccount = await this.userAccountRepository.findOne({
            where: {
                id: userAccountId,
                user: { id: userId },
            },
        });

        if (!userAccount) {
            throw new NotFoundException('User account not found');
        }

        // Create a new transaction linked to the user's account
        const transaction = this.transactionRepository.create({
            userAccount,
            amount,
            type,
            name,
        });

        return this.transactionRepository.save(transaction);
    }

    // Get all transactions for a specific user
    async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: {
                userAccount: {
                    user: { id: userId }
                }
            },
            relations: ['userAccount'],
        });
    }

}
