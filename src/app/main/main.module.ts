import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EarningsModule } from './earnings/earnings.module';
import { ProfileModule } from './profile/profile.module';
import { ReferralModule } from './referral/referral.module';
import { TasksModule } from './tasks/tasks.module';
import { MainComponent } from './main.component';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    IonicModule,
    MainRoutingModule,
    SharedModule,
    DashboardModule,
    EarningsModule,
    ProfileModule,
    ReferralModule,
    TasksModule
  ]
})
export class MainModule { }
