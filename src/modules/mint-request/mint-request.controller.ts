import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Next, NotFoundException, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { MintRequestService } from './mint-request.service';
import { STATUS } from './mint-request.entity';

@Controller('mint-request')
export class MintRequestController {
    constructor(private readonly requestService: MintRequestService) {


    
    }
    //create many mint request
    @Post('/request-many')
    async createManyMintRequest(@Body() gens: string[]){
        console.log('gens:', gens);
        const response = await this.requestService.findWithCondition({gen: {$in: gens}})
        if(response.length > 0){
            let genExits = await this.checkGensExits(gens);  
            throw new ConflictException(`${genExits.join(";")} gen already exists`)
        } 
        return this.requestService.createManyMintRequest(gens);
    }

    //get all mint request 
    @Get('get-request-submitting')
    async getAllMintRequest(){
        return this.requestService.findWithCondition({status: STATUS.SUBMITTING})
    }


    private async checkGensExits(gens: string[]){
        let genExits = []
        
        for(let gen of gens){            
            const response = await this.requestService.checkGenExits(gen)
            if(response) genExits.push(gen)
        }
        return genExits;
    }

}
