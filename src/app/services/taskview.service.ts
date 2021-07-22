import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { TaskviewComponent } from '../shared/taskview/taskview.component';

@Injectable({
  providedIn: 'root'
})
export class TaskviewService {

  public taskView = new BehaviorSubject<boolean>(false);
  public taskData = '';

  constructor(public modalController: ModalController) { }

  toggleTaskView(taskId) {
    this.taskData = taskId;
    this.taskView.next(true);
  }

  get taskViewStatus() {
    return this.taskView.asObservable();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TaskviewComponent,
      componentProps: {
        'firstName': 'Douglas'
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
