import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './user-account.entity';
import { User } from '../users/user.entity';

@Injectable()
export class UserAccountsService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async createUserAccount(userId: number, accountName: string, balance: number): Promise<UserAccount> {
    const newAccount = this.userAccountRepository.create({
      user: { id: userId }, // Linking the user
      account_name: accountName,
      balance,
    });

    return this.userAccountRepository.save(newAccount);
  }

  async getUserAccounts(userId: number): Promise<UserAccount[]> {
    return this.userAccountRepository.find({ where: { user: { id: userId } } });
  }
}
