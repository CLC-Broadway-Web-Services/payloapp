import { Component, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Profile } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable, Observer } from "rxjs";
import { ImageCroppedEvent } from 'ngx-image-cropper';
// import { NgxImageCompressService } from 'ngx-image-compress';


@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.scss'],
})
export class ProfileviewComponent implements OnInit {

  @ViewChild('userPhoto') userPhotoInput: any;

  phoneVerified = false;
  emailVerified = false;

  defaultProfileImage = '../../../../assets/default-avatar.png';

  userData: Profile;

  // profile image
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  phoneRecaptchaVerifier: firebase.default.auth.RecaptchaVerifier;

  constructor(
    public auth: AuthService,
    public loader: LoaderService,
    public alertController: AlertController,
    private fireStore: AngularFireStorage,
    // private imageCompress: NgxImageCompressService
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
      // const file = event.target.files[0];
      const file = event;
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
                this.auth.afAuth.currentUser.then((u) => {
                  u.updateProfile({
                    photoURL: this.fb
                  }).then(() => {
                    this.auth.updateProfile({
                      photoURL: this.fb
                    })
                    this.userPhotoInput.nativeElement.value = '';
                    this.loader.stopLoader();
                  })
                })
                // this.auth.updateProfile({
                //   photoURL: url
                // }).then(()=>{
                //   this.loader.stopLoader();
                // })
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


  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event.base64)
  }
  imageLoaded() {
    /* show cropper */
  }
  cropperReady() {
    /* cropper ready */
  }
  loadImageFailed() {
    /* show message */
  }

  imageUpload() {
    this.imageChangedEvent = null;
    console.log('call image upload')
    this.dataURItoBlob2(this.croppedImage)
  }


  //   compressFile() {

  //     this.imageCompress.uploadFile().then(({ image, orientation }) => {

  //       this.loader.showLoader();
  //       // this.imgResultBeforeCompress = image;
  //       console.warn('Size in bytes was:', this.imageCompress.byteCount(image));

  //       this.imageCompress.compressFile(image, orientation, 50, 50).then(
  //         result => {
  //           this.dataURItoBlob2(result)
  //           // this.imgResultAfterCompress = result;
  //           console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
  //           // this.loader.showLoader();
  //         }
  //       );

  //     });

  //   }

  dataURItoBlob2(dataURI) {
    this.croppedImage = null;
    this.loader.showLoader();
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const imageFile = new Blob([ia], { type: mimeString });
    this.onFileSelected(imageFile);
  }
  cancelCropping() {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.userPhotoInput.nativeElement.value = null;
  }

  async showPasswordInput() {
    const alert = await this.alertController.create({
      header: 'Change Password!',
      inputs: [
        {
          name: 'password',
          type: 'password',
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
            this.changePassword(d);
          }
        }
      ]
    });

    await alert.present();
  }
  async showPhoneNumberInput() {
    const alert = await this.alertController.create({
      header: 'Change Phone!',
      inputs: [
        {
          name: 'phoneNumber',
          type: 'number',
          attributes: {
            maxlength: 10,
            minlength: 10
          }
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
            this.changeUpdatePhone('+91'+d.phoneNumber);
          }
        }
      ]
    });

    await alert.present();
  }

  changePassword(newPassword) {
    console.log(newPassword.password);
    this.loader.showLoader().then(() => {
      this.auth.afAuth.currentUser.then((user) => {
        user.updatePassword(newPassword.password).then(() => {
          this.loader.stopLoader();
        }).catch(() => {
          this.loader.stopLoader();
        })
      })
    })
  }

  changeUpdatePhone(data) {
    console.log(data);
    const mobile = data;
    // return;
    this.loader.showLoader().then(() => {
      this.auth.afAuth.currentUser.then((user) => {
        // return user.updatePhoneNumber(mobile).then(() => {
          this.auth.afs.doc(`users/${user.uid}`).set({
            phoneNumber: mobile
          }, { merge: true }).then(() => {
            this.loader.stopLoader();
          }).catch(() => {
            this.loader.stopLoader();
          });
        // }).catch(() => {
        //   this.loader.stopLoader();
        // });
      })
    })
  }


}
