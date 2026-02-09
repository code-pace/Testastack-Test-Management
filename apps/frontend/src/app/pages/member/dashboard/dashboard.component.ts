import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailedComponent } from '../../../components/cards/dashboard-widgets/failed.component';
import { PassedComponent } from '../../../components/cards/dashboard-widgets/passed.component';
import { InProgressComponent } from '../../../components/cards/dashboard-widgets/in-progress.component';
import { ExecutionTrendComponent } from '../../../components/cards/dashboard-widgets/execution-trend.component';
import { TotalTestCasesComponent } from '../../../components/cards/dashboard-widgets/total-test-cases.component';
import { SuiteDistributionComponent } from '../../../components/cards/dashboard-widgets/suite-distribution.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TotalTestCasesComponent, FailedComponent, PassedComponent, InProgressComponent, ExecutionTrendComponent, SuiteDistributionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

}
