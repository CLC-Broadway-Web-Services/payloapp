import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFirePerformanceModule, PerformanceMonitoringService } from '@angular/fire/performance';

import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
// import { Device } from '@ionic-native/device/ngx';
// import { Autostart } from '@ionic-native/autostart/ngx';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { FCM } from '@ionic-native/fcm/ngx';
// import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';
// import firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'ios',
      swipeBackEnabled: true,
      sanitizerEnabled: true,
      hardwareBackButton: true
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireAnalyticsModule,
    AngularFirePerformanceModule,
    ImageCropperModule
  ],
  providers: [
    { provide: REGION, useValue: 'asia-south1' },
    LottieSplashScreen,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook,
    GooglePlus,
    ScreenTrackingService,
    UserTrackingService,
    PerformanceMonitoringService
    // { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 5001] : undefined },
    //  { provide: NEW_ORIGIN_BEHAVIOR, useValue: true },
    //  { provide: ORIGIN, useValue: 'http://localhost:5000/' },
    // FCM,
    // Device,
    // BackgroundMode,
    // Autostart,
    // Firebase,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
