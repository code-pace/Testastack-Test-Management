import { Body, Controller, Post, Req } from '@nestjs/common';
import { ColumnMappingService } from './column-mapping.service';

@Controller('api/v1/testcases')
export class ColumnMappingController {
  constructor(private readonly columnMappingService: ColumnMappingService) {}

  @Post('/column-mapping')
  async handleColumnMapping(@Body() body: any, @Req() req: any) {
    if (body && body.sheetUrl) {
      return this.columnMappingService.detectColumnsFromSheetUrl(body.sheetUrl);
    }

    return this.columnMappingService.detectColumnsFromUpload();
  }

  @Post('/processing')
  async handleProcessing(@Body() body: any) {
    return this.columnMappingService.continueProcessing(body);
  }
}
