import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  isMenuOpen = false;
  routes: ActivatedRoute = inject(ActivatedRoute);
  activeMenuItem: string = '';

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onMenuItemClick(): void {
    this.isMenuOpen = false;
  }

  menuItems = [
    { label: 'Dashboard', route: 'dashboard' },
    { label: 'Upload', route: 'upload' },
    { label: 'Test Suites', route: 'test-suites' },
    { label: 'AI Test Gen', route: 'ai-test-gen' },
    { label: 'Test Management', route: 'test-management' },
  ];
}
