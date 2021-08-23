import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileeditComponent } from './profileedit/profileedit.component';
import { ProfileviewComponent } from './profileview/profileview.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { NgxImageCompressService } from 'ngx-image-compress';


@NgModule({
  declarations: [ProfileComponent, ProfileviewComponent, ProfileeditComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ProfileRoutingModule,
    ImageCropperModule
  ],
  // providers: [NgxImageCompressService],
})
export class ProfileModule { }
