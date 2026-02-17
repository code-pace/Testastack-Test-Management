import { Injectable } from '@nestjs/common';

type DetectedSheet = {
  sheetName: string;
  columns: string[];
};

@Injectable()
export class ColumnMappingService {
  detectColumnsFromUpload(): any {
    const mockDetectedColumns: DetectedSheet[] = [
      {
        sheetName: 'Sheet 1',
        columns: ['Test Case ID', 'Title', 'Description', 'Priority', 'Status'],
      },
      {
        sheetName: 'Sheet 2',
        columns: ['ID', 'Name', 'Details', 'Severity', 'State'],
      },
      {
        sheetName: 'Sheet 3',
        columns: ['TC_ID', 'Test_Name', 'Test_Desc', 'Test_Priority', 'Test_Status'],
      },
    ];

    return {
      code: 0,
      message: 'Columns detected successfully',
      body: {
        uniqueId: 'abcdefg',
        sheets: mockDetectedColumns,
      },
    };
  }

  detectColumnsFromSheetUrl(sheetUrl: string): any {
    // In a real implementation this would fetch and parse the Google Sheet.
    // For now return the same mock payload used for uploads.
    return this.detectColumnsFromUpload();
  }

  continueProcessing(payload: any): any {
    // Accepts payload and returns a mock processing response.
    return {
      code: 0,
      message: 'Record pushed for processing. Open tracker to confirm operation status',
    };
  }
}
