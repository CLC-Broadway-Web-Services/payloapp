import { Component } from '@angular/core';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { IonRouterOutlet, Platform } from '@ionic/angular';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { slideInAnimation } from './services/animation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    slideInAnimation
  ]
})

export class AppComponent {

  constructor(
    // private device: Device,
    // private backgroundMode: BackgroundMode,
    // private autostart: Autostart,
    // private androidPermissions: AndroidPermissions,
    private platform: Platform,
    splashScreen: LottieSplashScreen
    // private routerOutlet: IonRouterOutlet
  ) {
    console.log(this.platform.platforms())
    if (this.platform.platforms().includes('android')) {
      // console.log('this is android')
      // console.log('Device UUID is: ' + this.device.uuid);
      // this.backgroundMode.enable();
      // this.autostart.enable();
      // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      //   result => console.log('Has permission?',result.hasPermission),
      //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      // );

      // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

      // this.platform.backButton.subscribeWithPriority(-1, () => {
      //   if (!this.routerOutlet.canGoBack()) {
      //     App.exitApp();
      //   }
      // });
    }
    platform.ready().then(() => {
      splashScreen.hide();
    })

    // this.fcmService.initPush();
  }



  prepareRoute(outlet: IonRouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
