import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UserAccountsModule } from './user-accounts/user-accounts.module';
import { AccountTransactionsModule } from './account-transactions/account-transactions.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    UsersModule,
    UserAccountsModule,
    AccountTransactionsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
