import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-referralpopup',
  templateUrl: './referralpopup.component.html',
  styleUrls: ['./referralpopup.component.scss'],
})
export class ReferralpopupComponent implements OnInit {
  @Input() htmlDataToParse: string;
  @Input() headerText: string;

  constructor() { }

  ngOnInit() { }

}
