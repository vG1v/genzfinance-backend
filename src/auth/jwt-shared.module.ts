import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'vornLovesecret69420!', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [JwtModule],
})
export class JwtSharedModule {}
