import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TaskviewComponent } from './taskview/taskview.component';
import { TaskhelpComponent } from './taskhelp/taskhelp.component';


@NgModule({
  declarations: [HeaderComponent, TaskviewComponent, TaskhelpComponent],
  imports: [
    RouterModule,
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    TaskviewComponent,
    TaskhelpComponent
  ]
})
export class SharedModule { }
