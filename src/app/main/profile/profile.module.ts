import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileeditComponent } from './profileedit/profileedit.component';
import { ProfileviewComponent } from './profileview/profileview.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ProfileComponent, ProfileviewComponent, ProfileeditComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
