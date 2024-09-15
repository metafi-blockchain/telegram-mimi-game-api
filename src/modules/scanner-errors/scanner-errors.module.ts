import { Module } from '@nestjs/common';
import { ScannerErrorsService } from './scanner-errors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScannerError, ScannerErrorSchema } from './scanner-error.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: ScannerError.name, schema: ScannerErrorSchema}]), 

  ],
  providers: [ScannerErrorsService],
  exports: [ScannerErrorsService]

})
export class ScannerErrorsModule {}
