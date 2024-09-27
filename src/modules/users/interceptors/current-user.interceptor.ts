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
        const id = request.user.id || ""

        console.log("Interceptors running==>",id )        
        
       if(id){
        const user = await this.userService.findById(id);
        request.currentUser = user;
       }
       return next.handle()
    }
    
}