import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtAuthService } from './jwt.auth.service';
import { JwtConfigService } from './jwt.config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: JwtAuthService, private readonly jwtConfigService: JwtConfigService ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:  jwtConfigService.createJwtOptions().secret
    });
  }

  //function nay chua chay vao khi validate token 
  //Thuong se viet logic validate o day
  async validate(payload: any) {
    
    console.log(payload);
    
    
    const user = await this.authService.isValidUserByUuid(payload.sub);
    console.log("JwtStrategy validate: ", user);

    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
