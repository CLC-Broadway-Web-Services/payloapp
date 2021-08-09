import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), data: {animation: 'FilterPage'} 
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule), data: {animation: 'FilterPage'} 
      },
      {
        path: 'earnings',
        loadChildren: () => import('./earnings/earnings.module').then(m => m.EarningsModule), data: {animation: 'FilterPage'} 
      },
      {
        path: 'referrals',
        loadChildren: () => import('./referral/referral.module').then(m => m.ReferralModule), data: {animation: 'HomePgae'} 
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), data: {animation: 'AboutPage'} 
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
