import { Injectable } from '@angular/core';

type DetectedColumn = {
  data: string; // Sheet name or file section
  columns: string[]; // Detected column names
};

@Injectable({
  providedIn: 'root',
})
export class ColumnMappingService {
  private mappingUrl: string = '/api/v1/testcases/column-mapping';
  detectedColumns: DetectedColumn[] = [];
  constructor() {}

  async callUploadApi(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(this.mappingUrl, {
        method: 'POST',
        body: formData,
      });
      // return await response.json();
      return await this.mockResponse(); // Use mock response for testing
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async callGoogleSheetUrlApi(url: string): Promise<any> {
    try {
      const response = await fetch(this.mappingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetUrl: url,
          requestType: 'GoogleSheet',
        }),
      });
      // return await response.json();
      return await this.mockResponse(); // Use mock response for testing
    } catch (error) {
      console.error('Error fetching Google Sheet data:', error);
      throw error;
    }
  }

  setDetectedColumns(columns: DetectedColumn[]): void {
    this.detectedColumns = columns;
  }

  async uploadFile(file: File): Promise<void> {
    const uploadPromise = await this.callUploadApi(file);
    this.setDetectedColumns(uploadPromise);
  }

  mockResponse(): Promise<any> {
    // Mock column detection based on file name
    const mockDetectedColumns = [
      {
        data: 'Sheet 1',
        columns: ['Test Case ID', 'Title', 'Description', 'Priority', 'Status'],
      },
      {
        data: 'Sheet 2',
        columns: ['ID', 'Name', 'Details', 'Severity', 'State'],
      },
      {
        data: 'Sheet 3',
        columns: ['TC_ID', 'Test_Name', 'Test_Desc', 'Test_Priority', 'Test_Status'],
      },
    ];
    const mockResponse = {
      code: 0,
      message: 'Columns detected successfully',
      body: {
        sheets: mockDetectedColumns,
      },
    };
    return Promise.resolve(mockResponse);
  }
}
