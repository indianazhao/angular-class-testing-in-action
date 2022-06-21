import { appRoutesNames } from './../app.routes.names';
import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { UserCredentials } from './../_types/user-credentials.type';

import { LoginComponent } from './login.component';
import { LoginService } from './login.service';

describe('LoginComponent', () => {
  let componentUnderTest: LoginComponent;
  let loginServiceSpy: Spy<LoginService>;
  let fakeValue: string;

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
    fakeValue = undefined;
  });

  // 2: 新增變數 registerLink 的測試，這個測試的 action type = INIT
  describe('INIT', () => {
    Then(() => {
      expect(componentUnderTest.registerLink).toEqual(`/${appRoutesNames.REGISTER}`)
    });

  });

  describe('EVENT: email changed', () => {
    When(() => {
      componentUnderTest.emailControl.setValue(fakeValue);
    });

    // 針對 email 的某種 validation 進行測試，寫完後可以複製/貼上，修改成另一個 email validation
    describe('GIVEN email is empty THEN email validation should fail', () => {
      Given(() => {
        fakeValue = '';
      });
      Then(() => {
        expect(componentUnderTest.emailControl.valid).toBeFalsy();
      });
    });

    describe('GIVEN email is not a valid email address THEN email validation should fail', () => {
      Given(() => {
        fakeValue = 'NOT A EMAIL';
      });
      Then(() => {
        expect(componentUnderTest.emailControl.valid).toBeFalsy();
      });
    });
  });

  describe('EVENT: password changed', () => {
    When(() => {
      componentUnderTest.passwordControl.setValue(fakeValue);
    });

    describe('GIVEN password is empty THEN password validation should fail', () => {
      Given(() => {
        fakeValue = '';
      });
      Then(() => {
        expect(componentUnderTest.passwordControl.valid).toBeFalsy();
      });
    });

    describe('GIVEN password is too short THEN password validation should fail', () => {
      Given(() => {
        fakeValue = '1234567';
      });
      Then(() => {
        expect(componentUnderTest.passwordControl.valid).toBeFalsy();
      });
    });
  });

  describe('Method: handleLogin', () => {
    let fakeCredentials: UserCredentials;

    When(() => {
      componentUnderTest.handleLogin();
    });

    describe('GIVEN form data is valid THEN pass credentials to the service', () => {

      Given(() => {
        fakeCredentials = {
          email: 'FAKE@EMAIL.com',
          password: 'FAKE PASSWORD',
        };

        componentUnderTest.loginForm.setValue(fakeCredentials);
      });

      Then(() => {
        expect(loginServiceSpy.login).toHaveBeenCalledWith(fakeCredentials);
      });
    });

    describe('GIVEN form data is invalid THEN do not pass credentials to the service', () => {

      Given(() => {
        fakeCredentials = {
          email: '',
          password: '',
        };

        componentUnderTest.loginForm.setValue(fakeCredentials);
      });

      Then(() => {
        // 這裡其實只要確認 login 沒被呼叫即可，根本不需要判斷是否沒被呼叫特定參數
        expect(loginServiceSpy.login).not.toHaveBeenCalled();
      });
    });

  });

});
