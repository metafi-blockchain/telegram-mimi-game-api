import { HttpStatus, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// import { ActivitylogsService } from 'src/activitylogs/activitylogs.service';
// import { JwtAuthService } from 'src/authentication/jwt.auth.service';







/**
 * Middleware will running before chay truoc JWT AUTH
 * Có thể dùng viết logic dùng chặn request (Có thể dùng thu viện helmet )
 * 
 */
@Injectable()
export class CustomMiddleware implements NestMiddleware {
  // constructor( private userService: UsersService) {}
   
  async use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} - ${req.baseUrl}`, );
    next();
  }
   
}


