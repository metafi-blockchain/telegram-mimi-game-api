import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Next, NotFoundException, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { MintRequestService } from './mint-request.service';

@Controller('mint-request')
export class MintRequestController {
    constructor(private readonly requestService: MintRequestService) {


    
    }
    //create many mint request
    @Post('/request-many')
    async createManyMintRequest(@Body() gens: string[]){
        console.log('gens:', gens);
        const response = await this.requestService.findWithCondition({gen: {$in: gens}})
        if(response.length > 0) throw new ConflictException('gen already exists')
        return this.requestService.createManyMintRequest(gens)  
       
        
    }
    //get all mint request 
    @Get('get-all')
    async getAllMintRequest(){
        return this.requestService.findAll()
    }

}
