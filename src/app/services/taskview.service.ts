import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../interfaces/tasks';
import { TaskhelpComponent } from '../shared/taskhelp/taskhelp.component';
import { TaskviewComponent } from '../shared/taskview/taskview.component';

@Injectable({
  providedIn: 'root'
})
export class TaskviewService {

  public taskView = new BehaviorSubject<boolean>(false);
  public taskData = '';

  constructor(
    public modalController: ModalController
  ) { }

  toggleTaskView(taskId) {
    this.taskData = taskId;
    this.taskView.next(true);
  }

  get taskViewStatus() {
    return this.taskView.asObservable();
  }

  async presentTaskModal(task: Task, taskType) {
    console.log(task)
    console.log(taskType)
    const modal = await this.modalController.create({
      component: TaskviewComponent,
      componentProps: {
        fullTask: task,
        taskType: taskType
      },
      cssClass: 'showTaskPopup2',
      swipeToClose: true,
      mode: 'ios'
    });
    return await modal.present();
  }

  async presentHelpModal(task) {
    const modal = await this.modalController.create({
      component: TaskhelpComponent,
      componentProps: {
        task: task,
      },
      cssClass: 'showTaskPopup',
      swipeToClose: true,
      mode: 'ios'
    });
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
  

}
