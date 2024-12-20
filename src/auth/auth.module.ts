// auth.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { JwtSharedModule } from './jwt-shared.module';

// Destroy Token for Logout logic
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  addTokenToBlacklist(token: string) {
    this.blacklistedTokens.add(token);
  }
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}

@Module({
  imports: [
    PassportModule,
    JwtSharedModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(()=> UsersModule),
  ],
  providers: [JwtStrategy, TokenBlacklistService],
  exports: [PassportModule, TokenBlacklistService],
})
export class AuthModule {}
