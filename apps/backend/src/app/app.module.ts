import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnMappingController } from './testcase-processor/column-mapping.controller';
import { ColumnMappingService } from './testcase-processor/column-mapping.service';

@Module({
  imports: [],
  controllers: [AppController, ColumnMappingController],
  providers: [AppService, ColumnMappingService],
})
export class AppModule {}
