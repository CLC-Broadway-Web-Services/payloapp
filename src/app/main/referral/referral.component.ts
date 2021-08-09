import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { Share } from '@capacitor/share';
import { ReferralpopupComponent } from './referralpopup/referralpopup.component';
import { AuthService } from 'src/app/services/auth.service';
import { Profile } from 'src/app/interfaces/profile';



@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss'],
})
export class ReferralComponent implements OnInit {

  showShareModule = true;

  // referListData = [
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  //   {
  //     name: 'Ahtesham',
  //     points: 5,
  //     date: 'Mon, Jun 29 2021'
  //   },
  // ];

  currentUserData: Profile;

  contentForTerms: string = 'Terms of service content.';
  contentForHowTo: string = 'How Invite system works content.';

  constructor(
    public global: GlobalFunctionsService,
    // public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.userData.asObservable().subscribe((user) => {
      this.currentUserData = user;
    })
  }

  refersChanged(event) {
    if (event.target.value == 'true') {
      this.showShareModule = true;
    } else {
      this.showShareModule = false;
    }
  }

  async socialShare() {
    console.log('social share clicked');
    const inviteCode: string = this.currentUserData && this.currentUserData.myInviteCode ? this.currentUserData.myInviteCode : "PL0011223344";
    await Share.share({
      title: 'PayLo | रोज़ का रोज़गार',
      text: 'Create account on Paylo & get (रोज़ का रोज़गार), User my code for registration:- ' + inviteCode,
      url: 'http://google.com/',
      dialogTitle: 'Share & Get Rewards',
    }).then((response) => {
      console.log(response)
    }).catch((err) => {
      console.log(err)
    })
  }

  async presentTermsModal() {
    const modal = await this.modalController.create({
      component: ReferralpopupComponent,
      componentProps: {
        'headerText': 'Terms of service.',
        'htmlDataToParse': this.contentForTerms,
      }
    });
    return await modal.present();
  }
  async presentHowToModal() {
    const modal = await this.modalController.create({
      component: ReferralpopupComponent,
      componentProps: {
        'headerText': 'How it Works !',
        'htmlDataToParse': this.contentForHowTo,
      }
    });
    return await modal.present();
  }

}
