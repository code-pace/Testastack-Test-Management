import { Injectable } from '@angular/core';

type DetectedColumn = {
  data: string; // Sheet name or file section
  columns: string[]; // Detected column names
}

@Injectable({
  providedIn: 'root'
})
export class ColumnMappingService {
  private uploadUrl: string = '/api/testcases/upload';
  detectedColumns: DetectedColumn[] = [];
  constructor() { 

  }

  async callUploadApi(file: File): Promise<DetectedColumn[]> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(this.uploadUrl, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message || 'Failed to upload file');
    }
    if (!result.data || !Array.isArray(result.data.columns)) {
      throw new Error('Invalid response from server: missing columns data');
    }
    return result.data.columns;
  }

  setDetectedColumns(columns: DetectedColumn[]): void {
    this.detectedColumns = columns;
  }

  async uploadFile(file: File): Promise<void> {
    const uploadPromise = await this.callUploadApi(file);
    this.setDetectedColumns(uploadPromise);
  }

  mockUploadFile(file: File): void {
    // Mock column detection based on file name
    this.detectedColumns = [
      {
        data: 'Sheet 1',
        columns: ['Test Case ID', 'Title', 'Description', 'Priority', 'Status']
      },
      {
        data: 'Sheet 2',
        columns: ['ID', 'Name', 'Details', 'Severity', 'State']
      },
      {
        data: 'Sheet 3',
        columns: ['TC_ID', 'Test_Name', 'Test_Desc', 'Test_Priority', 'Test_Status']
      }
    ];
  }
}
