import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UserAccount } from 'src/user-accounts/user-account.entity';
import { Transaction } from './transaction.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, UserAccount]),
    forwardRef(() => AuthModule),],
  providers: [TransactionsService],
  controllers: [TransactionsController]
})
export class TransactionsModule { }
