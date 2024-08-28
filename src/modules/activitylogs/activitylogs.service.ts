import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLogDto } from './activelogDtos/create.active.dto';
import { ActivityLog } from './activity-log.entity';

@Injectable()
export class ActivitylogsService {
    constructor(@InjectModel(ActivityLog.name) private model: Model<ActivityLog>){};

    create (active : ActivityLogDto){
        const data = new this.model(active)
        return  data.save() 
    }
}
