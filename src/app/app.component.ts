import { Component, QueryList, ViewChildren } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { Settings } from './interfaces/Settings';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { slideInAnimation } from './services/animation';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    slideInAnimation
  ]
})

export class AppComponent {
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    // private device: Device,
    // private backgroundMode: BackgroundMode,
    // private autostart: Autostart,
    // private androidPermissions: AndroidPermissions,
    private platform: Platform,
    splashScreen: LottieSplashScreen,
    private alertController: AlertController,
    private loader: LoaderService,
    private afs: AngularFirestore,
    private toastController: ToastController,
    private router: Router,
    // private routerOutlet: IonRouterOutlet
  ) {
    this.backButtonEvent();
    this.loader.showLoader().then(() => {
      this.afs.doc(`settings/app`).valueChanges().subscribe((settings: Settings) => {
        if (settings.maintenance) {
          this.presentAlertMaintenance(settings).then(() => {
            this.loader.stopLoader();
          })
        } else {
          this.loader.stopLoader();
        }
      })
    })
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
    // platform.ready().then(() => {
    //   splashScreen.hide();
    // })

    // this.fcmService.initPush();
  }
  async presentAlertMaintenance(setting: Settings) {
    let alert: HTMLIonAlertElement;
    if (setting.maintenanceType == 'updategoogleplay') {
      alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Maintenance Mode',
        subHeader: setting.maintenanceType,
        message: setting.message,
        buttons: [
          {
            text: 'Download',
            role: 'download',
            cssClass: 'primary',
            handler: () => {
              // go to website and close the app
              console.log('app update via website. ' + setting.url);
            }
          },
          {
            text: 'Google Play',
            role: 'googleplay',
            cssClass: 'secondary',
            handler: () => {
              // go to playstore and close the app
              console.log('app update via google play. ' + setting.playurl);
            }
          }
        ]
      });
    }
    if (setting.maintenanceType == 'update') {
      alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Maintenance Mode',
        subHeader: setting.maintenanceType,
        message: setting.message,
        buttons: [
          {
            text: 'Download',
            role: 'download',
            cssClass: 'primary',
            handler: () => {
              // go to website and close the app
              console.log('app update via website. ' + setting.url);
            }
          }
        ]
      });
    }
    if (setting.maintenanceType == 'maintenance') {
      alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Maintenance Mode',
        subHeader: setting.maintenanceType,
        message: setting.message,
        buttons: [
          {
            text: 'Ok',
            role: 'maintenance',
            cssClass: 'primary',
            handler: () => {
              // ok to close the app
              console.log('exit app from this');
            }
          }
        ]
      });
    }
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }


  prepareRoute(outlet: IonRouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {

      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();

        } else if (this.router.url === ('/main' || '/auth')) {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            // this.platform.exitApp(); // Exit from app
            navigator['app'].exitApp(); // work in ionic 4

          } else {
            const toast = await this.toastController.create({
              message: 'Press back again to exit App.',
              duration: 2000,
              position: 'middle'
            });
            toast.present();
            // console.log(JSON.stringify(toast));
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }
}
