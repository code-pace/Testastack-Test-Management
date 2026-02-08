import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalTestCasesComponent } from './total-test-cases.component';

describe('TotalTestCasesComponent', () => {
  let component: TotalTestCasesComponent;
  let fixture: ComponentFixture<TotalTestCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTestCasesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalTestCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
