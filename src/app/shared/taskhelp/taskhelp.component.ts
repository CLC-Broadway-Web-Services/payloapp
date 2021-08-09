import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-taskhelp',
  templateUrl: './taskhelp.component.html',
  styleUrls: ['./taskhelp.component.scss'],
})
export class TaskhelpComponent implements OnInit {
  @Input() taskPlatfrom: string;
  @Input() taskType: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() { }

  dismissModal() {
    this.modalController.dismiss();
  }

}
