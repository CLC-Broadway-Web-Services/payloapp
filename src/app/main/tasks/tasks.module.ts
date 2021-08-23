import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { MytasksComponent } from './mytasks/mytasks.component';


@NgModule({
  declarations: [TasksComponent, MytasksComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
