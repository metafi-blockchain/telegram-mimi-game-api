
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate{

     canActivate(context: ExecutionContext) {
        
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        //logic check auth

        const http = context.switchToHttp();
         const request = http.getRequest();
        // console.log(request);
        
        return request;
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