import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-execution-trend',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget execution-trend">
      <div class="header">
        <h3 class="title">Execution Trend</h3>
        <span class="period">Last 7 Days</span>
      </div>
      <div class="trend-chart">
        <!-- Placeholder for trend chart -->
      </div>
    </div>
  `,
  styleUrl: './dashboard-widgets.component.scss',
})
export class ExecutionTrendComponent {}
