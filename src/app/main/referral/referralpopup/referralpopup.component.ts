import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-referralpopup',
  templateUrl: './referralpopup.component.html',
  styleUrls: ['./referralpopup.component.scss'],
})
export class ReferralpopupComponent implements OnInit {
  @Input() htmlDataToParse: string;
  @Input() headerText: string;

  constructor(public modalController: ModalController,
    public global: GlobalFunctionsService) { }

  ngOnInit() { }

  dismissModal() {
    this.modalController.dismiss();
  }

}
