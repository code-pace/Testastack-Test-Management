import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnMappingService } from '../../../services/column-mapping.service';

interface ColumnMapping {
  fileColumn: string;
  testCaseField: string;
  required: boolean;
}

interface SuggestedMapping {
  field: string;
  label: string;
  required: boolean;
  suggestions: string[];
}

enum FileType {
  CSV = 'csv',
  EXCEL = 'xlsx',
  XLS = 'xls'
}


@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  googleSheetUrl: string = '';
  isUrlValid: boolean = true;
  isDragOver: boolean = false;
  showColumnMapping: boolean = false;
  fileColumns: string[] = [];
  detectedSheetsColumns: any[] = [];
  columnMappings: ColumnMapping[] = [];
  isProcessing: boolean = false;
  private columnMappingService = inject(ColumnMappingService);

  // Standard test case fields with intelligent suggestions
  suggestedMappings: SuggestedMapping[] = [
    {
      field: 'testCaseId',
      label: 'Test Case ID',
      required: false,
      suggestions: ['id', 'testcaseid', 'tc_id', 'case_id', 'test_id', 'testcase_id']
    },
    {
      field: 'testScenario',
      label: 'Test Scenario',
      required: true,
      suggestions: ['scenario', 'test_scenario', 'title', 'name', 'summary', 'description']
    },
    {
      field: 'precondition',
      label: 'Precondition',
      required: false,
      suggestions: ['precondition', 'pre_conditions', 'prerequisites', 'setup', 'given']
    },
    {
      field: 'testData',
      label: 'Test Data',
      required: false,
      suggestions: ['data', 'test_data', 'input_data', 'parameters', 'testdata']
    },
    {
      field: 'testSteps',
      label: 'Test Steps',
      required: true,
      suggestions: ['steps', 'test_steps', 'procedure', 'actions', 'how_to_test']
    },
    {
      field: 'expectedResult',
      label: 'Expected Result',
      required: true,
      suggestions: ['expected', 'expected_result', 'result', 'outcome', 'then']
    },
    {
      field: 'actualResult',
      label: 'Actual Result',
      required: false,
      suggestions: ['actual', 'actual_result', 'outcome_actual', 'result_actual']
    },
    {
      field: 'status',
      label: 'Status',
      required: false,
      suggestions: ['status', 'state', 'result_status', 'pass_fail', 'outcome_status']
    },
    {
      field: 'priority',
      label: 'Priority',
      required: false,
      suggestions: ['priority', 'importance', 'severity', 'level']
    },
    {
      field: 'notes',
      label: 'Notes',
      required: false,
      suggestions: ['notes', 'comments', 'remarks', 'additional_info', 'observations']
    }
  ];

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.checkSupportedFileType(file);
      console.log(this.selectedFile);
      console.log(this.isUrlValid);
      this.columnMappingService.mockUploadFile(file);
      if (this.columnMappingService.detectedColumns.length > 0) {
        this.detectedSheetsColumns = this.columnMappingService.detectedColumns;
        for(const sheet of this.detectedSheetsColumns) {
          console.log('Detected columns for sheet:', sheet.data, sheet.columns);
        }
      } else {
        this.detectedSheetsColumns = [];
        alert('No Sheets detected in the file. Please check the file format and try again.');
        return;
      }
    }
  }

  onGoogleSheetUrlChange(event: any): void {
    const tempUrl = event.target.value;
    const urlPattern = /^https:\/\/docs\.google\.com\/spreadsheets\/([a-zA-Z0-9-_]+)(\/.*)?$/;
    if (!urlPattern.test(tempUrl)) {
      this.isUrlValid = false;
    } else {
      this.isUrlValid = true;
      this.googleSheetUrl = tempUrl;
    }
  }
  disableConfigureMapping(): boolean {
    if (this.isProcessing) {
      return true;
    }
    else if (
      this.selectedFile && 
      !this.googleSheetUrl
    ) {
      return false;
    }
    else if (
      this.googleSheetUrl && 
      this.isUrlValid && 
      !(!!this.selectedFile)
    ) {
      return false;
    }
    return true;
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
    this.selectedFile = null;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    const numberOfFiles = files?.length || 0;
    if (files && numberOfFiles > 0) {
      if (numberOfFiles === 2) {
        alert('Please drop only one file at a time.');
        return;
      }
      this.checkSupportedFileType(files[0]);
      this.selectedFile = files[0];
    }
  }

  async  checkSupportedFileType(file: File): Promise<void> {
    try {
      const isFileValid = file.name.endsWith(FileType.CSV) || file.name.endsWith(FileType.EXCEL) || file.name.endsWith(FileType.XLS);
      if (!isFileValid) {
        console.error('Unsupported file type:', file.name);
        alert('Unsupported file type. Please upload a CSV or Excel file.');
        this.selectedFile = null;
        return;
      }
    }
    catch (error) {
      console.error('Error checking file type:', error);
      alert('Error checking file type. Please try again.');
      this.selectedFile = null;
      return;
    }
  }

  async processFileForColumns(file: File): Promise<void> {
    this.isProcessing = true;
    try {
      if (file.name.endsWith('.csv')) {
        await this.processCsvFile(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        await this.processExcelFile(file);
      }
      this.generateColumnMappings();
      this.showColumnMapping = true;
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the file format and try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  async processCsvFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      console.log(reader);
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          if (lines.length > 0) {
            // Assume first line contains headers
            const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
            this.fileColumns = headers.filter(header => header.length > 0);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  async processExcelFile(file: File): Promise<void> {
    // For now, we'll use a simple approach. In a real app, you'd use a library like xlsx
    // For demonstration, we'll assume the first row contains headers
    // This is a placeholder - in production, use a proper Excel parsing library
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // This is a simplified approach. In production, use a proper Excel library
          // For now, we'll create mock column names that might be typical
          console.log(e);
          this.fileColumns = [
            'Test Case ID', 'Test Scenario', 'Preconditions', 'Test Data', 
            'Test Steps', 'Expected Results', 'Actual Results', 'Status'
          ];
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  generateColumnMappings(): void {
    this.columnMappings = this.suggestedMappings.map(mapping => {
      const suggestedColumn = this.findBestMatch(mapping.suggestions, this.fileColumns);
      return {
        fileColumn: suggestedColumn || '',
        testCaseField: mapping.field,
        required: mapping.required
      };
    });
  }

  findBestMatch(suggestions: string[], availableColumns: string[]): string {
    for (const suggestion of suggestions) {
      const match = availableColumns.find(col => 
        col.toLowerCase().replace(/[^a-z0-9]/g, '') === suggestion.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      if (match) return match;
    }
    return '';
  }

  onMappingChange(mapping: ColumnMapping, selectedColumn: string): void {
    mapping.fileColumn = selectedColumn;
  }

  onSubmit(): void {
    if (this.selectedFile) {
      if (!this.showColumnMapping) {
        // If we haven't shown column mapping yet, process the file first
        this.processFileForColumns(this.selectedFile);
        return;
      }

      // Validate required mappings
      const missingRequired = this.columnMappings.filter(m => m.required && !m.fileColumn);
      if (missingRequired.length > 0) {
        alert(`Please map the following required fields: ${missingRequired.map(m => this.getFieldLabel(m.testCaseField)).join(', ')}`);
        return;
      }

      // Handle file upload with mappings
      console.log('Uploading file with mappings:', {
        file: this.selectedFile,
        mappings: this.columnMappings
      });
      // TODO: Implement file upload to backend with column mappings
    } else if (this.googleSheetUrl) {
      // Handle Google Sheet URL
      console.log('Processing Google Sheet URL:', this.googleSheetUrl);
      // TODO: Implement Google Sheet processing
    } else {
      alert('Please select a file or provide a Google Sheet URL');
    }
  }

  getFieldLabel(field: string): string {
    const mapping = this.suggestedMappings.find(m => m.field === field);
    return mapping ? mapping.label : field;
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.googleSheetUrl = '';
    this.showColumnMapping = false;
    this.fileColumns = [];
    this.columnMappings = [];
  }
}
