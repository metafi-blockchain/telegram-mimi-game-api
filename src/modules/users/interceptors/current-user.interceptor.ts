import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";


import { UsersService } from "../users.service";


// @UseInterceptors(CurrentUserInterceptor)
//Dung de xu ly truoc khi thao tac o controller
// cach dung

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userService : UsersService){}

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
       const request = context.switchToHttp().getRequest();
       // getUserId form request
        const uuid = request.user.uuid || ""

        console.log("Interceptors running==>",uuid )        
        
       if(uuid){
        const user = await this.userService.findByUuid(uuid);
        request.currentUser = user;
       }
       return next.handle()
    }
    
}