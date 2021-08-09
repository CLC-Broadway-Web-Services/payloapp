import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferralRoutingModule } from './referral-routing.module';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReferralComponent } from './referral.component';
import { ReferralpopupComponent } from './referralpopup/referralpopup.component';


@NgModule({
  declarations: [ReferralComponent, ReferralpopupComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ReferralRoutingModule
  ]
})
export class ReferralModule { }
