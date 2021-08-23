import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public globalService: GlobalFunctionsService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onLoginSubmit(){
    if(this.loginForm.valid) {
      this.auth.signIn(this.loginForm.value);
    } else {
      // this.loginForm.markAsDirty();
      this.loginForm.markAllAsTouched();
    }
  }

}
