import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongoProvider } from '../database/mongo.provider';
import { JwtStrategy } from './jwt.startegy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super-secret',
    }),
  ],
  providers: [AuthService, MongoProvider, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
