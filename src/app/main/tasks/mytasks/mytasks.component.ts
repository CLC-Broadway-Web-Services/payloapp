import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-mytasks',
  templateUrl: './mytasks.component.html',
  styleUrls: ['./mytasks.component.scss'],
})
export class MytasksComponent implements OnInit {

  @ViewChild('selectDate') selectDate;

  today = new Date();

  segmentValue = "today";

  calendarOptions = {
    buttons: [{
      text: 'Show Log',
      handler: () => console.log('Clicked Save!')
    }, {
      text: 'Cancel',
      handler: () => {
        console.log('Clicked Log. Do not Dismiss.');
        this.segmentValue = "today";
      }
    }]
  }

  constructor(public global: GlobalFunctionsService) { }

  ngOnInit() { }

  openCalendar() {
    this.selectDate.open();
  }

}
