import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Profile } from '../interfaces/profile';
import { LoaderService } from './loader.service';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Wallet } from '../interfaces/wallet';
import { Task } from '../interfaces/tasks';
import { map } from 'rxjs/operators';
// import { FCM } from '@ionic-native/fcm/ngx';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // subscriptions
  userSubscription: Subscription;
  userDataSubscription: Subscription;
  pointsWalletSubscription: Subscription;
  tasksListSubscription: Subscription;

  // userState: Profile;
  userState: firebase.User;
  userData = new BehaviorSubject<Profile>(null);
  userState2;
  userUid;
  userEmailVerify = false;

  userWallet = new BehaviorSubject<Wallet>(null);
  userTasks = new BehaviorSubject<Task[]>([]);

  // providorsData
  googleConnected = false;
  facebookConnected = false;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public loader: LoaderService,
    public alertController: AlertController,
    // private fcm: FCM
  ) {
    // this.linkSocialProfile();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.implementFCM();
        const date = Date.now();
        // console.log(date);
        const dateBeforeWeek = date - ((24 * 60 * 60 * 1000) * 7);
        // console.log(dateBeforeWeek);
        const today = this.formatDate(date);
        const lastWeek = this.formatDate(dateBeforeWeek);

        this.userState = user;

        console.log(this.formatDate(date));

        // if (!this.userDataSubscription) {
        this.userDataSubscription = this.afs.doc(`users/${user.uid}`).valueChanges().subscribe(async (data: Profile) => {
          this.userData.next(data);
          if (data && user) {
            if (user.emailVerified == true && data.emailVerified == false) {
              this.afs.doc(`users/${user.uid}`).set({ emailVerified: true }, { merge: true });
            }
            localStorage.setItem('userData', JSON.stringify(data));
            JSON.parse(localStorage.getItem('userData'));
          }
          // else {
          //   const userDataForFirestore = {
          //     photoURL: '',
          //     city: '',
          //     dob: '',
          //     state: '',
          //     phoneNumberVerify: false,
          //     totalReferrals: 0,
          //     completedTasks: 0,
          //     country: 'IN',
          //     uid: user.uid,
          //     email: user.email,
          //     phoneNumber: user.phoneNumber,
          //     displayName: user.displayName,
          //     emailVerified: false,
          //     inviteCode: 'PL0011223344',
          //     claim: 'user',
          //     myInviteCode: this.getRandomNumbe()
          //   };
          //   await this.afs.collection('users').doc(user.uid).set(userDataForFirestore, {
          //     merge: true
          //   });
          // }
        })
        console.log(user);
        // }

        // if (!this.pointsWalletSubscription) {
        this.pointsWalletSubscription = this.afs.doc(`pointsWallet/${user.uid}`).valueChanges().subscribe((wallet: Wallet) => {
          if (wallet) {
            const id = user.uid
            const cWallet = { id, ...wallet }
            this.userWallet.next(cWallet);
          }
          // else {
          //   const newWallet = {
          //     id: user.uid,
          //     totalPoints: 0,
          //     currentPoints: 0,
          //     totalConvertedPoints: 0,
          //     convertionRateInitial: 1,
          //     totalConvertedAmount: 0,
          //     withdrawlAmount: 0,
          //     userUpi: '',
          //     uid: user.uid
          //   }
          //   this.afs.collection(`pointsWallet/`).doc(user.uid).set(newWallet, { merge: true }).catch((err) => {
          //     console.log(err);
          //   })
          // }
        })
        // }

        // if (!this.tasksListSubscription) {
        // this.tasksListSubscription = this.afs.collectionGroup('tasks',
        //   (ref) => ref
        //     .where('uid', '==', user.uid)
        //     .where('allotedDate', '>=', lastWeek)
        //     // .where('allotedDate', '<=', today)
        //     .orderBy('allotedDate', 'desc')
        // ).valueChanges({ id: 'id' }).subscribe((tasks: Task[]) => {
        //   console.log(tasks)
        //   this.userTasks.next(tasks);
        // })

        this.tasksListSubscription = this.afs.collectionGroup('tasks',
          (ref) => ref
          .where('uid', '==', user.uid)
          .where('isSubmitted', '==', false)
            // .where('allotedDate', '>=', lastWeek)
            // .where('allotedDate', '<=', today)
            .orderBy('allotedDate', 'desc')
        ).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            let data = a.payload.doc.data();
            data['id'] = a.payload.doc.id;
            return data;
          }))
        ).subscribe((tasks: Task[]) => {
            console.log(tasks)
            this.userTasks.next(tasks);
          })
        // }
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
        localStorage.setItem('userData', null);
        JSON.parse(localStorage.getItem('userData'));
      }
    });
  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    // return [day, month, year].join('-');
    return [day, month, year].join('');
  }
  async signIn(payload: any) {
    return this.loader.showLoader().then(() => this.afAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then((result) => {
        // this.setUserData(result.user).then(() => {
        // this.router.navigate(['/main/dashboard']);
        // location.reload();
        // })
        this.ngZone.run(() => {
          this.router.navigate(['/main']);
        });
        this.loader.stopLoader();
      }).catch((error) => {
        window.alert(error.message);
        this.loader.stopLoader();
      }));
  }

  async registration(payload: any) {
    return this.loader.showLoader().then(() => {
      this.afAuth.createUserWithEmailAndPassword(payload.email, payload.password).then(async (userdata) => {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userdata.user.uid}`);
        const userDataForAuth = {
          uid: userdata.user.uid,
          email: userdata.user.email,
          phoneNumber: payload.newMobile,
          displayName: payload.name,
          emailVerified: false,
        };
        const userDataForFirestore = {
          photoURL: '',
          city: '',
          dob: '',
          state: '',
          phoneNumberVerify: false,
          totalReferrals: 0,
          completedTasks: 0,
          country: 'IN',
          uid: userdata.user.uid,
          email: userdata.user.email,
          phoneNumber: payload.newMobile,
          displayName: payload.name,
          emailVerified: false,
          inviteCode: payload.invitecode,
          claim: 'user',
          myInviteCode: this.getRandomNumbe()
        };
        (await this.afAuth.currentUser).updateProfile(userDataForAuth).then(async () => {
          await userRef.set(userDataForAuth, {
            merge: true
          }).then(async () => {
            await this.afs.collection('users').doc(userdata.user.uid).set(userDataForFirestore, {
              merge: true
            }).then(() => {
              this.SendVerificationMail().then(() => {
                this.presentAlert('Registration Success', 'Please verify your email before getting tasks.', 'success');
                this.loader.stopLoader();
                this.ngZone.run(() => {
                  this.router.navigate(['/main']);
                });
              })
            }).catch(error => {
              this.signOut();
              this.loader.stopLoader();
              console.log(error)
              this.presentAlert('Registration Error', error.msg, 'error');
            });
          }).catch(error => {
            this.signOut();
            this.loader.stopLoader();
            console.log(error)
            this.presentAlert('Registration Error', error.msg, 'error');
          });
        }).catch(error => {
          this.signOut();
          this.loader.stopLoader();
          console.log(error)
          this.presentAlert('Registration Error', error.msg, 'error');
        });
      }).catch(error => {
        this.signOut();
        this.loader.stopLoader();
        console.log(error)
        this.presentAlert('Registration Error', error.msg, 'error');
      });
    });
  }
  getRandomNumbe() {
    const string = 'PL';
    return string + Date.now().toString().substring(0, 10);
  }
  async SendVerificationMail() {
    return (await this.afAuth.currentUser).sendEmailVerification()
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
              this.router.navigate(['/auth/login']);
              // location.reload();
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

  async signOut() {
    return this.loader.showLoader().then(() => this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      localStorage.clear();
      this.router.navigate(['/auth']);
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
      if (this.userDataSubscription) {
        this.userDataSubscription.unsubscribe();
      }
      if (this.pointsWalletSubscription) {
        this.pointsWalletSubscription.unsubscribe();
      }
      if (this.tasksListSubscription) {
        this.tasksListSubscription.unsubscribe();
      }
      this.loader.stopLoader();
    }));
  }

  async updateProfile(payload) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.userUid}`);
    const userRef2 = this.afs.collection('users').doc(this.userUid); 2
    await userRef.set(payload, {
      merge: true
    });
    userRef2.set(payload, {
      merge: true
    });
  }
  // link social profiles
  linkFacebook() {
    // return this.loader.showLoader().then(() => 
    this.linkSocialProfile(new firebase.auth.FacebookAuthProvider())
    // );
  }
  linkGoogle() {
    // return this.loader.showLoader().then(() =>
    this.linkSocialProfile(new firebase.auth.GoogleAuthProvider())
    // );
  }
  linkTwitter() {
    // return this.loader.showLoader().then(() =>
    this.linkSocialProfile(new firebase.auth.TwitterAuthProvider())
    // );
  }
  linkPhone() {
    // return this.loader.showLoader().then(() =>
    this.linkSocialProfile(new firebase.auth.PhoneAuthProvider())
    // );
  }

  // not available providers
  // Instagram
  // LinkedIn

  linkSocialProfile(provider: firebase.auth.AuthProvider) {
    this.afAuth.currentUser.then((user) => {
      user.linkWithRedirect(provider).then((response) => {
        // Accounts successfully linked.
        // const data = {
        //   credential: response.credential,
        //   userX: response.user,
        //   result: response
        // };
        console.log(response);
        // this.loader.stopLoader();
        // location.reload();
      }).catch((error) => {
        window.alert(error.message);
        // this.loader.stopLoader();
      });
    });
  }
  unlinkSocial(providerId) {
    this.afAuth.currentUser.then((user) => {
      user.unlink(providerId);
    });
  }

  implementFCM() {
    // this.fcm.subscribeToTopic('task');

    // this.fcm.getToken().then(token => {
    //   // backend.registerToken(token);
    // });

    // this.fcm.onNotification().subscribe(data => {
    //   if (data.wasTapped) {
    //     console.log("Received in background");
    //   } else {
    //     console.log("Received in foreground");
    //   };
    // });

    // this.fcm.onTokenRefresh().subscribe(token => {
    //   // backend.registerToken(token);
    // });

    // this.fcm.hasPermission().then(hasPermission => {
    //   if (hasPermission) {
    //     console.log("Has permission!");
    //   }
    // })

    // this.fcm.clearAllNotifications();

    // this.fcm.unsubscribeFromTopic('marketing');
  }
}
