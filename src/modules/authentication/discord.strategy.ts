import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // console.log(configService.get<string>('APP_DISCORD_CALLBACK_URI'));

    super({
      clientID: configService.get<string>('APP_DISCORD_API_KEY'),
      clientSecret: configService.get<string>('APP_DISCORD_API_SECRET_KEY'),
      callbackURL: configService.get<string>('APP_DISCORD_CALLBACK_URI'),
      scope: ['identify', 'email'],
    //   passReqToCallback: true, // add thuoc tinh nay thi chi lay dc token phau validate lai user
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {


      return profile
    //   done(null, user);
  }

}
