
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class SelfUserGuard implements CanActivate{
    constructor( private userService: UsersService ) {}
    async canActivate(context: ExecutionContext) {
        

       const req = context.switchToHttp().getRequest();    
        
    try {
        if(!req.user){
            return false
        }
        if(req.user.administrator){
          return req.user.administrator
        }
        return req.user.uuid === req.body.uuid
        
    } catch (err) { 
        console.log(err);
        
        return false
    }
      }
      handleRequest(err, user, info) {
        console.log(info);
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw err || new UnauthorizedException();
        }
        return user;
      }
}