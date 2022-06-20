import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ld-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  // 4
  handleLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.loginService.login(credentials);
    }
  }

}
