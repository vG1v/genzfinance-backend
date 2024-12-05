import { Module } from '@nestjs/common';
import { AccountTransactionsController } from './account-transactions.controller';
import { AccountTransactionsService } from './account-transactions.service';

@Module({
  controllers: [AccountTransactionsController],
  providers: [AccountTransactionsService]
})
export class AccountTransactionsModule {}
