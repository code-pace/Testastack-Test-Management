import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-failed',
  standalone: true,
  imports: [CommonModule],
  template: `<p>failed works!</p>`,
  styleUrl: './dashboard-widgets.component.scss',
})
export class FailedComponent {}
