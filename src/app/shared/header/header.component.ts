import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
// import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  // eslint-disable-next-line @typescript-eslint/member-ordering
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('heading') heading: string;
  verificationEmailIsSent = false;

  defaultAvatar = 'assets/default-avatar.png';
  userData: Profile;

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.userData.asObservable().subscribe((userdata: Profile) => {
      if (userdata) {
        console.log(userdata);
        this.userData = userdata;
        // this.emailVerified = userdata.emailVerified;
      }
    })
  }

  // sendVerificationEmail() {
  //   this.auth.loader.showLoader().then(() => this.auth.afAuth.currentUser.then(user => user.sendEmailVerification()).then(() => {
  //     const message = 'Please check your email and verify your email, then login again to getting the tasks.';
  //     this.verificationEmailIsSent = true;
  //     this.auth.presentAlert('Verification', message, 'error');
  //     this.auth.loader.stopLoader();
  //   }));
  // }

}
