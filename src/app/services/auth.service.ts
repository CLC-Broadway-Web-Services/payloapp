import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Profile } from '../interfaces/profile';
import { LoaderService } from './loader.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiurl = environment.apiUrl;
  // userState: Profile;
  userState: firebase.User;
  userData = new BehaviorSubject<Profile>(null);
  userState2;
  userUid;
  userEmailVerify = false;

  // providorsData
  googleConnected = false;
  facebookConnected = false;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public loader: LoaderService,
    private http: HttpClient,
    public alertController: AlertController
  ) {
    // this.linkSocialProfile();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userState = user;
        this.afs.doc(`users/${user.uid}`).valueChanges().subscribe((data: Profile) => {
          this.userData.next(data);
        })
        console.log(user);

        user.providerData.some((data) => {
          if (data.providerId == 'google.com') {
            this.googleConnected = true;
          }
          if (data.providerId == 'facebook.com') {
            this.facebookConnected = true;
          }
        });

        this.userUid = user.uid;
        this.userEmailVerify = user.emailVerified;
        localStorage.setItem('user', JSON.stringify(this.userState));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  async signIn(payload: any) {
    return this.loader.showLoader().then(() => this.afAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then((result) => {
        this.setUserData(result.user);
        this.ngZone.run(() => {
          this.router.navigate(['/']);
        });
        this.loader.stopLoader();
      }).catch((error) => {
        window.alert(error.message);
        this.loader.stopLoader();
      }));
  }

  async registration(payload: any) {
    return this.loader.showLoader().then(() => {
      const userData = {
        fullname: payload.name,
        email: payload.email,
        password: payload.password,
        inviteCode: payload.invitecode,
        phoneNumber: payload.mobile
      };
      console.log(payload);
      console.log(userData);
      return;
      const headers = new HttpHeaders().set('requesttype', 'userApp');
      this.http.post(`${this.apiurl}auth/registration`, userData, { headers }).subscribe((result: any) => {
        if (!result.success) {
          this.presentAlert('Registration Error', result.error.message, 'error');
        } else {
          this.presentAlert('Registration Success', 'Please login to start.', 'success');
          console.log(result);
        }
      });
    });
  }
  async presentAlert(alertName, alertMessage, alertType) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: alertName,
      message: alertMessage,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            if (alertType === 'success') {
              location.reload();
            }
          }
        }
      ]
    });

    await alert.present();

    // const { role } = await alert.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }

  async sendVerificationMail() {
    // var phoneAuth = new firebase.auth.PhoneAuthProvider();
    // phoneAuth.verifyPhoneNumber
    return this.afAuth.currentUser.then(u => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['email-verification']);
      });
  }

  async forgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  setUserData(user, fullname?, inviteCode?, phoneNumber?) {
    console.log(user);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    this.userState2 = {
      uid: user.uid,
      email: user.email,
      phoneNumber: phoneNumber ? phoneNumber : user.phoneNumber,
      displayName: fullname ? fullname : user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    if (inviteCode) {
      this.userState2.inviteCode = inviteCode;
      this.afs.collection('users').doc(user.uid).set(this.userState2, {
        merge: true
      });
    }
    return userRef.set(this.userState2, {
      merge: true
    });
  }

  async signOut() {
    return this.loader.showLoader().then(() => this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.clear();
      this.router.navigate(['authorization']);
      this.loader.stopLoader();
    }));
  }

  updateProfile(payload) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.userUid}`);
    const userRef2 = this.afs.collection('users').doc(this.userUid); 2
    return userRef.set(payload, {
      merge: true
    }).then(() => {
      userRef2.set(payload, {
        merge: true
      });
    })
  }
  // updateAdditionalProfile(payload) {
  //   const userRef = this.afs.collection('users').doc(this.userUid);
  //   return userRef.set(payload, {
  //     merge: true
  //   });
  // }

  // link social profiles
  linkFacebook() {
    return this.loader.showLoader().then(() => this.linkSocialProfile(new firebase.auth.FacebookAuthProvider()));
  }
  linkGoogle() {
    return this.loader.showLoader().then(() => this.linkSocialProfile(new firebase.auth.GoogleAuthProvider()));
  }
  linkTwitter() {
    return this.loader.showLoader().then(() => this.linkSocialProfile(new firebase.auth.TwitterAuthProvider()));
  }
  linkPhone() {
    return this.loader.showLoader().then(() => this.linkSocialProfile(new firebase.auth.PhoneAuthProvider()));
  }

  // not available providers
  // Instagram
  // LinkedIn

  linkSocialProfile(provider: firebase.auth.AuthProvider) {
    this.afAuth.currentUser.then((user) => {
      user.linkWithPopup(provider).then((response) => {
        // Accounts successfully linked.
        const data = {
          credential: response.credential,
          userX: response.user,
          result: response
        };
        console.log(data);
        this.loader.stopLoader();
        location.reload();
      }).catch((error) => {
        window.alert(error.message);
        this.loader.stopLoader();
      });
    });
  }
  unlinkSocial(providerId){
    this.afAuth.currentUser.then((user) => {
      user.unlink(providerId);
    });
  }
}
