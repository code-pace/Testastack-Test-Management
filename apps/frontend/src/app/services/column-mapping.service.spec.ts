import { TestBed } from '@angular/core/testing';

import { ColumnMappingService } from './column-mapping.service';

describe('ColumnMappingService', () => {
  let service: ColumnMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
