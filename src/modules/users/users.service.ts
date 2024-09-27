import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../commons/base.service';
import { User } from './user.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import moment from 'moment';
import { POINT_CONFIG, TELEGRAM_AGE } from 'src/constants/telegram';
import { ConnectXDto } from './dtos/connect-x.dto';

@Injectable()
export class UsersService extends BaseService<User>{

    constructor(@InjectModel(User.name) private userModel: Model<User>){
        super(userModel)
    };


     // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  // Check if a user exists by xId
  async isExisted(xId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ xId });
    return !!user;
  }

  // Paginate users (example method using pagination plugin)
  async paginateUsers(page: number, limit: number): Promise<any> {
    //@ts-ignore
    return this.userModel.paginate({}, { page, limit });
  }

  // Other methods for interacting with users
  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

    logout(user: User){
        const {_id, version} = user;
        return this.userModel.findByIdAndUpdate(_id, {version: version + 1}).exec() ; 
    }

    async createAccount(telegramId: string, createAccountDto: CreateAccountDto): Promise<User> {
        const { name, referId, isPremium, username } = createAccountDto;
    
        const foundKey = TELEGRAM_AGE.findIndex((item) => Number(item.start) <= Number(telegramId));
        const fromStartYear = Math.ceil(
          ((+telegramId - TELEGRAM_AGE[foundKey].start) * 365) /
            (TELEGRAM_AGE[foundKey + 1].start - TELEGRAM_AGE[foundKey].start)
        );
        const telegramAge = moment().diff(
          moment(TELEGRAM_AGE[foundKey].year).add(fromStartYear, 'day'),
          'year'
        );
    
        const telegramAgePoint = POINT_CONFIG.CREATE_ACCOUNT_POINT;
        const balance = telegramAgePoint + (isPremium ? POINT_CONFIG.TELEGRAM_VERIFIED : 0);
    
        let user = await this.userModel.findOne({ telegramId });
        if (user) {
          throw new BadRequestException('Your account already exists');
        }
    
        user = new this.userModel({
          name,
          telegramId,
          telegramUserName: username,
          telegramAge,
          telegramAgePoint,
          telegramVerified: isPremium,
          telegramVerifiedPoint: isPremium ? POINT_CONFIG.TELEGRAM_VERIFIED : 0,
          pointReferedTo: referId !== telegramId ? POINT_CONFIG.REFER_RATE * balance : 0,
          balance,
          referId: referId !== telegramId ? referId : '',
        });
    
        await user.save();
    
        if (referId !== telegramId) {
          const referUser = await this.userModel.findOne({ telegramId: referId });
          if (referUser) {
            await this.updateReferUser(referUser, balance);
          }
        }
    
        return user;
      }
      private async updateReferUser(referUser: User, balance: number): Promise<void> {
        await this.userModel.updateOne(
          { telegramId: referUser.telegramId },
          {
            balance: referUser.balance + POINT_CONFIG.REFER_RATE * balance,
            telegramReferPoint: (referUser.telegramReferPoint || 0) + POINT_CONFIG.REFER_RATE * balance,
          }
        );
    
        const startWeek = moment().startOf('week').valueOf();
        const endWeek = moment().endOf('week').valueOf();
        // const weeklyReport = await this.weeklyFriendModel.findOne({
        //   telegramId: referUser.telegramId,
        //   startdate: startWeek,
        //   enddate: endWeek,
        // });
    
        // if (!weeklyReport) {
        //   await this.weeklyFriendModel.create({
        //     telegramId: referUser.telegramId,
        //     startdate: startWeek,
        //     enddate: endWeek,
        //     friends: 1,
        //     name: referUser.name,
        //   });
        // } else {
        //   await this.weeklyFriendModel.updateOne(
        //     { _id: weeklyReport._id },
        //     { friends: weeklyReport.friends + 1 }
        //   );
        // }
      }

      
      async connectX(telegramId: string, connectXDto: ConnectXDto): Promise<boolean> {
        const { xId, xName, xAccount, xFollowers, xCreatedAt, xAvatar, xVerified } = connectXDto;
    
        const user = await this.userModel.findOne({ telegramId });
        if (user.xId) {
          throw new BadRequestException('You already connected X');
        }
    
        const xAgePoint = moment().diff(moment(Number(xCreatedAt)), 'day') * POINT_CONFIG.AGE_POINT;
        const xVerifiedPoint = xVerified === 'true' ? POINT_CONFIG.XVERIFIED : 0;
        const xFollowerPoint = xFollowers * POINT_CONFIG.FOLLOWER_POINT;
        const xBalance = xAgePoint + xVerifiedPoint + xFollowerPoint;
    
        await this.userModel.updateOne(
          { telegramId },
          {
            xId,
            xName,
            xAccount,
            xAvatar,
            xFollowers,
            xVerified: xVerified === 'true',
            xAgePoint,
            xVerifiedPoint,
            xFollowerPoint,
            balance: user.balance + xBalance,
          }
        );
    
        if (user.referId) {
          const referUser = await this.userModel.findOne({ telegramId: user.referId });
          if (referUser) {
            await this.userModel.updateOne(
              { telegramId: referUser.telegramId },
              {
                balance: referUser.balance + POINT_CONFIG.REFER_RATE * xBalance,
                xReferPoint: (referUser.xReferPoint || 0) + POINT_CONFIG.REFER_RATE * xBalance,
              }
            );
          }
        }
        return true;
      }

      findByTelegramId(telegramId: string): Promise<User> {
        return this.userModel.findOne({ telegramId }).exec();
      }


      async increasePoint(telegramId: string): Promise<Number> {
        const userUpdate = await this.userModel.findOne({ telegramId}).exec();
        if (!userUpdate) {
          throw new NotFoundException('User not found');
        }
        const point = userUpdate.balance + POINT_CONFIG.INCREASE_POINT_CLICK;
        await this.userModel.updateOne({ telegramId }, { balance: point });
        return point;
        
      };

}
