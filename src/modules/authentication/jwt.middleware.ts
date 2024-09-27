import { HttpStatus, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// import { ActivitylogsService } from 'src/activitylogs/activitylogs.service';
// import { JwtAuthService } from 'src/authentication/jwt.auth.service';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { User} from '../users/user.entity'
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';



declare global{
  namespace Express {
    interface Request {
      user?: User
    }
    interface Multer {
      file?: User
    }
  }
}


/**
 * Middleware will running before  dung de chan logic user login. signup
 * Có thể dùng viết logic dùng chặn request (Có thể dùng thu viện helmet )
 * 
 */
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor( private userService: UsersService ,private readonly configService: ConfigService) {}
   
  async use(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization;
    try {
      console.log("==== Middleware is running =====");
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
      if(token){
        const pathFile =  this.configService.get<string>('JTW_PUBLIC_PATH_FILE');

        const public_key = fs.readFileSync(pathFile, 'utf8')
        
        const decoded =  jwt.verify(token ,public_key);

        const  email = decoded.sub as string
        console.log("email", email);
        
        
        // const user = await this.userService.findByEmail(email);
        
        // req.user = user;
        next();
      }else{
        return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Auth token is not supplied'" })
    }
        
  } else{
    return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Auth token is not supplied'" })
  }
       
}
  catch(error){
    return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Token expired" })
  }

    }
   
  


}


