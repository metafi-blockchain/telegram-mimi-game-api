import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import * as fs from 'fs';
import { JwtAuthService } from '../modules/authentication/jwt.auth.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    private readonly jwtConfigService: ConfigService, 
    private readonly userService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext) {

    console.log("JwtAuthGuard running");

    const PathFile = this.jwtConfigService.get('JTW_PUBLIC_PATH_FILE');
    const publicKey = fs.readFileSync(PathFile, 'utf-8')

    const req = context.switchToHttp().getRequest();
    // console.log(req.headers)
    const authHeader = req.headers.authorization;

    // console.log(`authHeader`, authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    const token = authHeader.split(' ')[1];

    if(!token) throw new UnauthorizedException();

    try {
      const decoded = jwt.verify(token, publicKey)

      
      const email = <string>decoded.sub;

      //@ts-ignore
      const version = <number>decoded.version

      //product can get it from redis
      const user = await this.userService.findById(email);

      req.user = user;
      if(user.version !== version){
         throw new UnauthorizedException("User logout!");
      }
      // console.log(uuid)
      return req;
    } catch (err) {
      throw new UnauthorizedException("Token expired!");
    }
  }
  
}
