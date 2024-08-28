import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';


@Injectable()
export class AdminSystemGuard implements CanActivate {

  // constructor( private userService: UsersService ) {}
  async canActivate(context: ExecutionContext) {

    const req = context.switchToHttp().getRequest();    
        
    try {
        if(!req.user){
            return false
        }
        return req.user.administrator
        
    } catch (err) { 
        console.log(err);
        
        return false
    }
  }
}
