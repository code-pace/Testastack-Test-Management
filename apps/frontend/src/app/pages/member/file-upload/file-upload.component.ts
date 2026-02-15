import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnMappingService } from '../../../services/column-mapping.service';

interface ColumnState {
  name: string;
  selected: boolean;
}

interface ColumnMapping {
  sheetName: string;
  columns: ColumnState[];
  selectAll?: boolean;
  allowColumnSelection?: boolean;
}

interface FinalSheetColumnMapping {
  sheetName: string;
  columns: string[];
}

interface SheetColumnMappingPayload {
  uniqueId: string;
  data: FinalSheetColumnMapping[];
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
  sheetColumns: ColumnMapping[] = [];
  minColumnsRequired: number = 3;
  finalSheetColumnMapping: FinalSheetColumnMapping[] = [];
  isProcessing: boolean = false;
  processingUniqueId: string = '';
  private columnMappingService = inject(ColumnMappingService);
  window: Window = window;

  ngOnInit(): void {
    console.log(window);
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.checkSupportedFileType(file);
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

  findBestMatch(suggestions: string[], availableColumns: string[]): string {
    for (const suggestion of suggestions) {
      const match = availableColumns.find(col => 
        col.toLowerCase().replace(/[^a-z0-9]/g, '') === suggestion.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      if (match) return match;
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    let response: any;
    if (this.selectedFile) {
      response = await this.columnMappingService.callUploadApi(this.selectedFile);
    } 
    else if (this.googleSheetUrl) {
      response = await this.columnMappingService.callGoogleSheetUrlApi(this.googleSheetUrl);
    };
  
    if(!response || response.code !== 0) {
      alert('Error detecting columns. Please check the file or URL and try again.');
      return;
    };
    this.sheetColumns = response.body.sheets.map((sheet: ColumnMapping) => {
      return {
        sheetName: sheet.sheetName,
        columns: sheet.columns.map((col: ColumnState) => ({ name: col, selected: true })),
        selectAll: true,
        allowColumnSelection: sheet.columns.length >= this.minColumnsRequired
      }
    });
    this.processingUniqueId = response.body.uniqueId;
    console.log(this.sheetColumns);
    this.clearSelection();
    this.showColumnMapping = true;

  }

  resetSheet(sheet: ColumnMapping): void {
    if (!sheet.allowColumnSelection) {
      sheet.allowColumnSelection = !sheet.allowColumnSelection;
      this.toggleSelectAll(sheet);
    }
    else {
      sheet.allowColumnSelection = !sheet.allowColumnSelection;
      this.toggleSelectAll(sheet);
    }
    
  }

  toggleSelectAll(sheet: ColumnMapping): void {
    if (sheet.selectAll && sheet.allowColumnSelection) {
      sheet.allowColumnSelection = false;
    }
    sheet.selectAll = !sheet.selectAll;
    sheet.columns.forEach((column: any) => {
      column.selected = sheet.selectAll;
    });
  }

  toggleSelectColumn(sheet: ColumnMapping, column: ColumnState): void {
    column.selected = !column.selected;
    sheet.selectAll = sheet.columns.every((col: ColumnState) => col.selected);
    if(this.sheetByColumnNumberSelectedMaxCheck(sheet)) {
      this.disableSheetColumnSelection(sheet);
    } else {
      this.enableSheetColumnSelection(sheet);
    }
  }

  sheetByColumnNumberSelectedMaxCheck(sheet: ColumnMapping): boolean {
    const selectedCount = sheet.columns.filter(col => col.selected).length;
    return selectedCount < this.minColumnsRequired;
  }

  disableSheetColumnSelection(sheet: ColumnMapping): void {
    sheet.allowColumnSelection = false;
  }

  enableSheetColumnSelection(sheet: ColumnMapping): void {
    sheet.allowColumnSelection = true;
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.googleSheetUrl = '';
    this.showColumnMapping = false;
  }

  async submitMappedData(): Promise<void> {
    let payload: SheetColumnMappingPayload;
    this.finalSheetColumnMapping = 
      this.sheetColumns
      .filter(sheet => sheet.allowColumnSelection)
      .map(sheet => ({
        sheetName: sheet.sheetName,
        columns: sheet.columns
          .filter(column => column.selected)
          .map(column => column.name)
      }));
    if (this.finalSheetColumnMapping.length === 0) {
      alert('Please select at least one sheet with the required number of columns.');
      return;
    }
    payload = {
      data: this.finalSheetColumnMapping,
      uniqueId: this.processingUniqueId
    }
    console.log(payload);
    const response = await this.columnMappingService.continueProcessing(payload)
    if(!response || response.code !== 0) {
      alert('Error processing data. Please try again.');
      return;
    }
  }
}
