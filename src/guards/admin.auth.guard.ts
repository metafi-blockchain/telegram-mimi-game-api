import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {

  // constructor( private userService: UsersService ) {}
  async canActivate(context: ExecutionContext) {

    const req = context.switchToHttp().getRequest();    
        
    try {
        if(!req.user){
            return false
        }
        return req.user.admin
        
    } catch (err) { 
        console.log(err);
        
        return false
    }
  }
}
