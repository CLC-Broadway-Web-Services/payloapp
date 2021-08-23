import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MytasksComponent } from './mytasks/mytasks.component';
import { TasksComponent } from './tasks.component';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: '',
        component: MytasksComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
