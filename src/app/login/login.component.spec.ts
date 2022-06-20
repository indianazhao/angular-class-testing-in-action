import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { UserCredentials } from './../_types/user-credentials.type';

import { LoginComponent } from './login.component';
import { LoginService } from './login.service';

describe('LoginComponent', () => {
  let componentUnderTest: LoginComponent;
  let loginServiceSpy: Spy<LoginService>;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginComponent,
        {
          provide: LoginService,
          useValue: createSpyFromClass(LoginService),
        },
      ]
    });

    componentUnderTest = TestBed.inject(LoginComponent);
    loginServiceSpy = TestBed.inject<any>(LoginService);
  });

  describe('Method: handleLogin', () => {
    let fakeCredentials: UserCredentials;

    When(() => {
      componentUnderTest.handleLogin();
    });

    describe('GIVEN form data is valid THEN pass credentials to the service', () => {

      Given(() => {
        // form data is valid

        // 1
        fakeCredentials = {
          email: 'FAKE EMAIL',
          password: 'FAKE PASSWORD',
        };

        // 2
        componentUnderTest.loginForm.setValue(fakeCredentials);
      });

      Then(() => {
        // pass credentials to the service

        // 3
        expect(loginServiceSpy.login).toHaveBeenCalledWith(fakeCredentials);
      });
    });

  });

});
