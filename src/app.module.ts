import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserAccountsModule } from './user-accounts/user-accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UserAccount } from './user-accounts/user-account.entity';
import { TransactionsModule } from './transactions/transactions.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Transaction } from './transactions/transaction.entity';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, UserAccount, Transaction],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    UserAccountsModule,
    CategoriesModule,
    AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
