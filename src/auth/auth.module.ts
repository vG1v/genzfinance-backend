import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'vornLovesecret69420!',  
      signOptions: { expiresIn: '1h' }, 
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
