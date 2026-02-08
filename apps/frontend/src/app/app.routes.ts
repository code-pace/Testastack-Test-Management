import { Routes } from '@angular/router';
import { FileUploadComponent } from './pages/member/file-upload/file-upload.component';
import { DashboardComponent } from './pages/member/dashboard/dashboard.component';

export const appRoutes: Routes = [
  { 
    path: '', 
    redirectTo: 'member/upload', 
    pathMatch: 'full' 
  },
  { 
    path: 'member/upload', 
    component: FileUploadComponent 
  },
  { 
    path: 'member/dashboard', 
    component: DashboardComponent 
  },
];
