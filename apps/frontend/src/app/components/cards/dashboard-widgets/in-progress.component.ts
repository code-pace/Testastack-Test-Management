import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-in-progress',
  standalone: true,
  imports: [CommonModule],
  template: `<p>in-progress works!</p>`,
  styleUrl: './dashboard-widgets.component.scss',
})
export class InProgressComponent {}
