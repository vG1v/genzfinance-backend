// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { JwtSharedModule } from './jwt-shared.module'; // Import shared module

@Module({
  imports: [
    PassportModule,
    JwtSharedModule, 
    TypeOrmModule.forFeature([User]),
    UsersModule,
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
