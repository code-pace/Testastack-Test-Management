import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="welcome">
      <h1>Welcome to TestaStack frontend</h1>
      <p>Starter component — delete when ready.</p>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
