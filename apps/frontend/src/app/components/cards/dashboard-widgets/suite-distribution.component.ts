import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suite-distribution',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget suite-distribution">
      <div class="header">
        <h3 class="title">Suite Distribution</h3>
      </div>
      <div class="doughnut-chart">
        <!-- Placeholder for trend chart -->
      </div>
    </div>
  `,
  styleUrl: './dashboard-widgets.component.scss',
})
export class SuiteDistributionComponent {}
