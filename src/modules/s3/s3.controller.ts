import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
// import { multerS3 } from 'multer-s3';

@UseGuards(JwtAuthGuard)
@Controller('s3')
export class S3Controller {
    constructor(
        private readonly s3Service: S3Service,
    ) { }

    // @Post('/upload')
    // @UseInterceptors(FileInterceptor('file'))
    // async uploadFiles(@UploadedFile(
    //     new ParseFilePipe({
    //     validators: [
    //         new MaxFileSizeValidator({ maxSize: 52428800 }),
    //         // new FileTypeValidator({ fileType: 'image/jpeg' }) || new FileTypeValidator({ fileType: 'image/png' }) || new FileTypeValidator({ fileType: 'image/jpg' }),
    //     ],
    //     }),)
    // file: Multer.File) {
    //     // console.log(file);

    //     return this.s3Service.uploadFile(file.buffer, `${file.originalname}_${new Date().getTime()}`, file.mimetype);
    // }


}
