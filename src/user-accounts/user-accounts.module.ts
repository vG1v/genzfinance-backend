import { Module } from '@nestjs/common';
import { UserAccountsController } from './user-accounts.controller';
import { UserAccountsService } from './user-accounts.service';

@Module({
  controllers: [UserAccountsController],
  providers: [UserAccountsService]
})
export class UserAccountsModule {}
