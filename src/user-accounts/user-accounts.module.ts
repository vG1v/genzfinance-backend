import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './user-account.entity';
import { UserAccountsService } from './user-accounts.service';
import { UserAccountsController } from './user-accounts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), UsersModule],
  providers: [UserAccountsService],
  controllers: [UserAccountsController],
})
export class UserAccountsModule {}
