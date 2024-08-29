import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { TOKENS } from 'src/blockchains/utils/app.enums';
import { v4 as uuidv4 } from 'uuid';
import { AuthAddressDto, AuthSocialDto } from './dto/login.dto';
import { JwtConfigService } from './jwt.config.service';
import * as fs from 'fs';



@Injectable()
export class JwtAuthService {

  constructor(private jwtService: JwtService,
    private userService: UsersService,

    private readonly jwtConfigService: JwtConfigService) { }


  

  


  // async signup(email: string, password: string){

  //   const users = await this.userService.findAll(email)
  //   if (users.length) {
  //       throw new ConflictException("Email in use!");

  //   }
  //   const pwdHash = await hashPassword(password);

  //   const uuid =  uuidv4();

  //   //@ts-ignore
  //   const user = await  this.userService.create({email, password: pwdHash, uuid}) ;

  //   //@ts-ignore
  //   const accessToken = await this.generateAccessToken(user);
  //   // const refreshToken = await this.generateRefreshToken(user);

  //   return {
  //     access_token: accessToken,
  //     // refresh_token : refreshToken
  //   };
  // }



  



  //validate user
  // async validateUser(email : string, password: string) : Promise<UserDto>{

  //   const  [user] = await this.userService.findAll({email});

  //   if(!user) return null;
  //   if(!user.password || !password ) return null
  //   const checkPwd = await comparePassword(user.password, password);

  //   if(!checkPwd) return null;
  //   return user;

  // }


  async verifyAsyncToken(token: string) {

    return await this.jwtService.verifyAsync(token);
  }

  verifyToken(token: string) {

    return this.jwtService.verify(token, {
      algorithms: [TOKENS.ENCRYPT_ALGORITHMS],
      secret: this.jwtConfigService.createJwtOptions().secret
    });
  }

  async isValidUserByEmail(email: string) {
    return await this.userService.findAll();
  }
  async isValidUserByUuid(uuid: string) {
    // console.log(uuid);

    return await this.userService.findByUuid(uuid);
  }



  async isHasAddress(address: string, type: string) {

    let query = {}
    switch (type) {

      case 'erc20':
        query = { deleted: false, erc20_addresses: address }

      case 'move':
        query = { deleted: false, move_addresses: address }
        break;
    }
    return await this.userService.findAll();;

  }



  async generateAccessToken(user: UserDto) {
    const payload = { sub: user.address, user_id: user._id, version: user.version };
    // console.log(payload);

    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(user: UserDto) {
    const payload = { sub: user.address, user_id: user._id };
    return this.jwtService.sign(payload, { expiresIn: TOKENS.REFRESH_TOKEN_DURATION });
  }
}
