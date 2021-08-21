import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/interfaces/tasks';

@Component({
  selector: 'app-taskhelp',
  templateUrl: './taskhelp.component.html',
  styleUrls: ['./taskhelp.component.scss'],
})
export class TaskhelpComponent implements OnInit {
  @Input() task: Task;

  constructor(public modalController: ModalController) { }

  ngOnInit() { }

  dismissModal() {
    this.modalController.dismiss();
  }

}
