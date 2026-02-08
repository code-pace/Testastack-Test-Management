import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiteDistributionComponent } from './suite-distribution.component';

describe('SuiteDistributionComponent', () => {
  let component: SuiteDistributionComponent;
  let fixture: ComponentFixture<SuiteDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiteDistributionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiteDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
