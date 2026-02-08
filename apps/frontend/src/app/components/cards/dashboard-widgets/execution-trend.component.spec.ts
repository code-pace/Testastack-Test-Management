import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecutionTrendComponent } from './execution-trend.component';

describe('ExecutionTrendComponent', () => {
  let component: ExecutionTrendComponent;
  let fixture: ComponentFixture<ExecutionTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionTrendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutionTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
