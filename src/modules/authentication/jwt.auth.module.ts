import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';;
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './jwt.auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtConfigService } from './jwt.config.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),

    UsersModule,
    PassportModule,
   ],
  controllers: [AuthController],
  providers: [ JwtConfigService, JwtAuthService, JwtStrategy], 
  exports: [JWTAuthModule],

})
export class JWTAuthModule {}