import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { TokenBlacklistService } from './auth.module'; 

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(TokenBlacklistService)
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {
    super();
  }

  canActivate(context: any) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (this.tokenBlacklistService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return super.canActivate(context);
  }
}
