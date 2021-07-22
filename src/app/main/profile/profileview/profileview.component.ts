import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Profile } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";


@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.scss'],
})
export class ProfileviewComponent implements OnInit {

  phoneVerified = false;
  emailVerified = false;

  defaultProfileImage = '../../../../assets/default-avatar.png';

  userData: Profile;

  // profile image
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;

  constructor(
    public auth: AuthService,
    public loader: LoaderService,
    public alertController: AlertController,
    private fireStore: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.auth.userData.asObservable().subscribe((userdata: Profile) => {
      if (userdata) {
        console.log(userdata);
        this.userData = userdata;
        this.emailVerified = userdata.emailVerified;
      }
    })
  }

  sendEmailVerification() {
    this.loader.showLoader().then(() => {
      this.auth.afAuth.currentUser.then(u => u.sendEmailVerification())
        .then(async () => {
          const alert = await this.alertController.create({
            header: 'Email Verification',
            // subHeader: 'Subtitle',
            message: `Verification email has been sent your email (${this.userData.email}). Please check your inbox and verify your email.`,
            buttons: [{ text: 'Ok' }]
          });
          await alert.present();
          this.loader.stopLoader();
        });
    });
  }

  async showNameForm() {
    const alert = await this.alertController.create({
      header: 'Change Name!',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          value: this.auth.userState && this.auth.userState.displayName ? this.auth.userState.displayName : '',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (d) => {
            this.submitName(d);
          }
        }
      ]
    });

    await alert.present();
  }
  async shoeDOBForm() {
    const alert = await this.alertController.create({
      header: 'Choose Name!',
      inputs: [
        {
          name: 'dob',
          type: 'date',
          value: this.userData && this.userData.dob ? this.userData.dob : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (d) => {
            this.submitMobile(d);
          }
        }
      ]
    });

    await alert.present();
  }
  async showCityForm() {
    const alert = await this.alertController.create({
      header: 'City / State',
      inputs: [
        {
          name: 'city',
          type: 'text',
          value: this.userData && this.userData.city ? this.userData.city : '',
          placeholder: 'City'
        },
        {
          name: 'state',
          type: 'text',
          value: this.userData && this.userData.state ? this.userData.state : '',
          placeholder: 'State'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (d) => {
            this.submitCityState(d);
          }
        }
      ]
    });

    await alert.present();
  }

  submitName(data) {
    console.log(data);
    this.auth.updateProfile(data);
    // this.auth.updateAdditionalProfile(data);
  }
  submitMobile(data) {
    console.log(data);
    this.auth.updateProfile(data);
  }
  submitCityState(data) {
    console.log(data);
    this.auth.updateProfile(data);
  }

  // removeGoogle(){
  //   this.auth.unlinkSocial('google.com');
  // }

  onFileSelected(event) {
    this.loader.showLoader().then(() => {
      var n = Date.now();
      const file = event.target.files[0];
      console.log(file);
      const filePath = `profileImages/${this.auth.userUid}/${n}`;
      const fileRef = this.fireStore.ref(filePath);
      const task = this.fireStore.upload(`profileImages/${this.auth.userUid}/${n}`, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.fb = url;

                this.auth.updateProfile({
                  photoURL: url
                }).then(()=>{
                  this.loader.stopLoader();
                })
              }
              console.log(this.fb);
            });
          })
        )
        .subscribe(url => {
          if (url.bytesTransferred === url.totalBytes && this.fb) {
            console.log(url);
            console.log(this.fb);
          }
        });
    })
  }
}
