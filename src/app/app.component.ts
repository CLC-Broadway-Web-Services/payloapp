import { Component } from '@angular/core';
// import { IonRouterOutlet, Platform } from '@ionic/angular';
// import { Plugins } from '@capacitor/core';
// eslint-disable-next-line @typescript-eslint/naming-convention
// const { App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    // private platform: Platform,
    // private routerOutlet: IonRouterOutlet
  ) {
    // this.platform.backButton.subscribeWithPriority(-1, () => {
    //   if (!this.routerOutlet.canGoBack()) {
    //     App.exitApp();
    //   }
    // });
  }
}
