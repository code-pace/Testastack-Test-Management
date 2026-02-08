import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passed',
  standalone: true,
  imports: [CommonModule],
  template: `<p>passed works!</p>`,
  styleUrl: './dashboard-widgets.component.scss',
})
export class PassedComponent {}
