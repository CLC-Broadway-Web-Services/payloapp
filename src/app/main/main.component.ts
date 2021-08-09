import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { slideInAnimation } from '../services/animation';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  prepareRoute(outlet: IonRouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
