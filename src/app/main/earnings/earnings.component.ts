import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Points } from 'src/app/interfaces/Points';
import { Profile } from 'src/app/interfaces/profile';
import { Wallet } from 'src/app/interfaces/wallet';
import { Withdrawl } from 'src/app/interfaces/Withdrawl';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { LoaderService } from 'src/app/services/loader.service';
import { map } from 'rxjs/operators'
import * as firebase from 'firebase';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
})
export class EarningsComponent implements OnInit {

  // myWallet: Wallet = {
  //   id: '',
  //   totalPoints: 0,
  //   currentPoints: 0,
  //   totalConvertedPoints: 0,
  //   convertionRateInitial: 1,
  //   totalConvertedAmount: 0,
  //   withdrawlAmount: 0,
  //   userUpi: '',
  //   uid: ''
  // };
  myWallet = new Wallet;

  pointsHistory: Points[];
  convertionWithdrawls: Withdrawl[];

  showUpiForm = false;

  showModule = 'wallet'; // history / convertions / wallet

  walletForm: FormGroup;
  upiForm: FormGroup;

  // test variables only
  detailsTrue = true;
  testUserId = "8jv3uzHBppfj0TesSzRjbD07KLp2";

  constructor(
    public global: GlobalFunctionsService,
    public fb: FormBuilder,
    public alertController: AlertController,
    public loader: LoaderService,
    public auth: AuthService
  ) {
  }

  ngOnInit() {
    this.walletForm = this.fb.group({
      points: [50, [Validators.required, Validators.min(50)]],
      convertionRate: [this.myWallet.convertionRateInitial, [Validators.required]],
      uid: ['', [Validators.required]],
      amount: [50, [Validators.required, Validators.min(50)]],
      isRequested: [true, [Validators.required]],
      upi_id: [this.myWallet.userUpi, [Validators.required]],
      timeCreated: [''],
    });
    this.upiForm = this.fb.group({
      userUpi: ['', [Validators.required]]
    });
    this.walletForm.controls.points.valueChanges.subscribe((points: number) => {
      if (points >= 50) {
        this.walletForm.controls.amount.patchValue(points);
      }
    })
    this.auth.userData.asObservable().subscribe((userdata: Profile) => {
      if (userdata) {
        // console.log(userdata);
        // this.userData = userdata;
        this.auth.userWallet.asObservable().subscribe((wallet: Wallet) => {
          console.log(wallet);
          if (wallet) {
            this.myWallet = wallet;
            this.walletForm.controls.uid.patchValue(wallet.uid);
            this.walletForm.controls.upi_id.patchValue(wallet.userUpi);
            this.walletForm.controls.convertionRate.patchValue(wallet.convertionRateInitial);
            this.upiForm.controls.userUpi.patchValue(wallet.userUpi);
            // this.auth.afs.collection('pointsConvertion', ref => ref.where('uid', '==', wallet.uid))
            //   .valueChanges().subscribe((convertions: Withdrawl[]) => {
            //     console.log(convertions)
            //     this.convertionWithdrawls = convertions;
            //   })

            console.log('started pointsConvertions');
            this.auth.afs.collection('pointsConvertion', ref => ref.where('uid', '==', wallet.uid))
              .snapshotChanges().pipe(map(
                (actions) => {
                  return actions.map(a => {
                    const data: any = a.payload.doc.data()
                    const id = a.payload.doc.id
                    const thisData = { ...data, id }
                    return thisData;
                  })
                }
              )).subscribe((data: Withdrawl[]) => {
                console.log(data);
                this.convertionWithdrawls = data;
              })
            // this.auth.afs.collection('points', ref => ref.where('referedUserUid', '==', wallet.uid).limit(20))
            // .valueChanges().subscribe((pointsData: Points[])=> {
            //   console.log(pointsData)
            //   this.pointsHistory = pointsData;
            // })
          }
        })
      }
    })
    this.walletForm.valueChanges.subscribe((form) => {
      console.log(form)
    })
  }

  modulePageChange(event) {
    this.showModule = event.target.value;
  }

  showAlertForConvertion(convertionId: string) {
    const filteration = this.convertionWithdrawls.filter((c => { return c.id == convertionId }));
    if (filteration.length > 0) {
      const list = filteration[0];
      // completed
      if (list.isRequested && list.isCompleted && !list.isRejected && !list.isOnHold) {
        this.showCompleteAlert(list);
      }
      // rejected
      if (list.isRequested && !list.isCompleted && list.isRejected && !list.isOnHold) {
        this.showRejectedAlert(list);
      }
      // on-hold
      if (list.isRequested && !list.isCompleted && !list.isRejected && list.isOnHold) {
        this.showOnHoldAlert(list);
      }
    }
  }

  async showCompleteAlert(data: Withdrawl) {
    const alert = await this.alertController.create({
      header: 'Transaction Details',
      translucent: true,
      message: data.transactionId,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
        }
      }
      ]
    });
    await alert.present();
  }
  async showRejectedAlert(data: Withdrawl) {
    const alert = await this.alertController.create({
      header: 'Reject reason',
      translucent: true,
      message: data.rejectReason,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
        }
      }
      ]
    });
    await alert.present();
  }
  async showOnHoldAlert(data: Withdrawl) {
    const alert = await this.alertController.create({
      header: 'On-Hold Details',
      translucent: true,
      message: data.onHoldReason,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
        }
      }
      ]
    });
    await alert.present();
  }

  async saveUpiId() {
    if (this.upiForm.valid && this.myWallet.userUpi !== this.upiForm.controls.userUpi.value) {
      this.loader.showLoader();
      this.auth.afs.doc(`pointsWallet/${this.myWallet.uid}`).set(this.upiForm.value, { merge: true }).then(() => {
        // this.auth.afs.doc(`pointsWallet/${this.testUserId}`).set(this.upiForm.value, { merge: true }).then(() => {
        this.loader.stopLoader();
      }).catch((err) => {
        alert(err.message);
        this.loader.stopLoader();
      })
    }
  }

  async createWithdrawlRequest() {
    if (this.walletForm.valid && this.myWallet.uid) {
      this.walletForm.controls.timeCreated.patchValue(Date.now());
      this.loader.showLoader();
      console.log(this.walletForm.valid)
      this.auth.afs.collection(`pointsConvertion`).add(this.walletForm.value).then((response) => {
        console.log(response)
        // new data
        const pointsToDeduct = this.walletForm.controls.points.value;
        const amountToDeduct = this.walletForm.controls.amount.value;

        const newData = {
          currentPoints: this.myWallet.currentPoints - pointsToDeduct,
          totalConvertedPoints: this.myWallet.totalConvertedPoints + pointsToDeduct,
          totalConvertedAmount: this.myWallet.totalConvertedAmount + amountToDeduct,
          uid: this.myWallet.uid,
          userUpi: this.myWallet.userUpi,
          convertionRateInitial: this.myWallet.convertionRateInitial
        }
        this.auth.afs.doc(`pointsWallet/${this.myWallet.uid}`).set(newData, { merge: true })
          .then((response) => {
            console.log(response)
            this.loader.stopLoader();
          })
          .catch((err) => {
            console.log(err)
            this.loader.stopLoader();
            alert(err.message);
          })
      })
        .catch((err) => {
          this.loader.stopLoader();
          alert(err.message);
        })
    }
  }

}
