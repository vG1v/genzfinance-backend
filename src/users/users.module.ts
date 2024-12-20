// users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtSharedModule } from '../auth/jwt-shared.module'; // Import shared module

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtSharedModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
