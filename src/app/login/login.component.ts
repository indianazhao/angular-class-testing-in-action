import { appRoutesNames } from './../app.routes.names';
import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ld-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // 3
  registerLink = `/${appRoutesNames.REGISTER}`;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  // 我們不喜歡「字串」，所以使用這個函式讓測試可以取得 email 的 formControl
  get emailControl(): AbstractControl{
    return this.loginForm.get('email');
  }

  get passwordControl(): AbstractControl{
    return this.loginForm.get('password');
  }

  handleLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.loginService.login(credentials);
    }
  }

}
