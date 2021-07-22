import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { inviteCode } from 'src/app/interfaces/InviteCodes';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  apiurl = environment.apiUrl;

  inviteCodeObservable = new BehaviorSubject<boolean>(false);

  inviteCodeValid = false;

  registerForm: FormGroup;

  codes: inviteCode[];

  constructor(
    public fb: FormBuilder,
    public globalService: GlobalFunctionsService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.createForms();
    this.auth.afs.collection('inviteCodes').valueChanges().subscribe((codes: inviteCode[]) => {
      this.codes = codes;
    });
    this.registerForm.controls.invitecode.valueChanges.subscribe((code) => {
      this.codes.some((c) => {
        if (c.code == code) {
          this.inviteCodeObservable.next(true);
        } else {
          this.inviteCodeObservable.next(false);
        }
      });
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
  }

  createForms() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      invitecode: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onRegisterSubmit() {
    if (!this.registerForm.invalid &&
      this.registerForm.controls.password.value === this.registerForm.controls.confirmPassword.value &&
      this.inviteCodeValid) {
      this.auth.registration(this.registerForm.value);
    }
  }

}
