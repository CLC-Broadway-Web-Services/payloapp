import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { inviteCode } from 'src/app/interfaces/InviteCodes';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  inviteCodeObservable = new BehaviorSubject<boolean>(false);

  webUrl = environment.website;

  inviteCodeValid = false;

  registerForm: FormGroup;

  confirmPasswordValid = false;

  constructor(
    public fb: FormBuilder,
    public globalService: GlobalFunctionsService,
    private auth: AuthService,
    public loader: LoaderService,

  ) { }

  ngOnInit() {
    this.createForms();
    this.registerForm.controls.invitecode.valueChanges.subscribe((code: string) => {
      if (code.length === 12) {
        this.loader.showLoader();
        console.log(code);
        this.getInviteCode(code);
      }
    });

    this.inviteCodeObservable.asObservable().subscribe((value) => {
      if (value) {
        this.inviteCodeValid = true;
        console.log(true);
      } else {
        this.inviteCodeValid = false;
        console.log(false);
        this.registerForm.controls.invitecode.markAsDirty;
      }
    })

    this.registerForm.controls.confirmPassword.valueChanges.subscribe((value) => {
      if (value !== this.registerForm.controls.password.value) {
        this.confirmPasswordValid = false;
      } else {
        this.confirmPasswordValid = true;
      }
    })
  }

  getInviteCode(code) {
    const demoCode = 'ASAA07121988';
    this.auth.afs.collection('inviteCodes', (ref) =>
      ref.where('code', '==', code)
    ).valueChanges().subscribe((codes: inviteCode[]) => {
      console.log(codes);
      if (codes && codes.length > 0) {
        this.inviteCodeObservable.next(true);
      } else {
        this.inviteCodeObservable.next(false);
      }
      this.loader.stopLoader();
    });
  }

  createForms() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      invitecode: ['', [Validators.required, Validators.minLength(8)]],
      consentAgree: [false, [Validators.required, Validators.requiredTrue]]
    });
  }

  onRegisterSubmit() {
    if (!this.registerForm.invalid && this.confirmPasswordValid && this.inviteCodeValid) {
      // console.log('form valid');
      // return;
      const number = this.registerForm.controls.mobile.value;
      // this.registerForm.controls.mobile.setValue('+91'+number);
      this.registerForm.addControl('newMobile', new FormControl('+91' + number));
      console.log(this.registerForm.value);
      this.auth.registration(this.registerForm.value);
    }
  }

  openLink(link: string) {
    window.open(link, '_system', 'location=yes'); return false;
  }

}
