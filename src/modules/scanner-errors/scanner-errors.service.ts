import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ScannerError } from './scanner-error.entity';
import { BaseService } from '../commons/base.service';
import { Model } from 'mongoose';

@Injectable()
export class ScannerErrorsService extends BaseService<ScannerError> {
    constructor(
        @InjectModel(ScannerError.name) private _model: Model<ScannerError>,


    ) {
        super(_model)
    }
}
