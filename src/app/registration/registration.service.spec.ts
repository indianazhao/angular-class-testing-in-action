import { RegistrationDetails } from './../_types/registration-details.type';
import { appRoutesNames } from './../app.routes.names';
import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { RouterAdapterService } from '../_services/adapters/router-adapter/router-adapter.service';
import { RegistrationService } from './registration.service';
import { UserRemoteService } from '../_services/user-remote/user-remote.service';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';

describe('RegistrationService', () => {
  let serviceUnderTest: RegistrationService;
  let routerAdapterServiceSpy: Spy<RouterAdapterService>;
  let userRemoteServiceSpy: Spy<UserRemoteService>;
  let llamaRemoteServiceSpy: Spy<LlamaRemoteService>;

  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        RegistrationService,
        { provide: RouterAdapterService, useValue: createSpyFromClass(RouterAdapterService) },
        { provide: UserRemoteService, useValue: createSpyFromClass(UserRemoteService) },
        { provide: LlamaRemoteService, useValue: createSpyFromClass(LlamaRemoteService) },
      ]
    });

    serviceUnderTest = TestBed.inject(RegistrationService);
    routerAdapterServiceSpy = TestBed.inject<any>(RouterAdapterService);
    userRemoteServiceSpy = TestBed.inject<any>(UserRemoteService);
    llamaRemoteServiceSpy = TestBed.inject<any>(LlamaRemoteService);

    actualResult = undefined;
  });

  // 1
  describe('METHOD: registerNewUser', () => {
    let fakeRegistrationDetails: RegistrationDetails;

    // 2
    When(() => {
      serviceUnderTest.registerNewUser(fakeRegistrationDetails);
    });

    // 3
    describe('GIVEN user and llama created successfully THEN then redirect to login', () => {
      Given(() => {
        // 5: user and llama created successfully
        fakeRegistrationDetails = {
          user: {
            email: 'fake@fake.com',
            password: 'FAKE PASSWORD',
          },
          llama: {
            name: 'FAKE NAME',
            imageFileName: 'FAKE IMAGE FILE NAME',
          },
        };

        // 6: CREATE USER -> create UserRemoteService (類似 LlamaRemoteService)
        userRemoteServiceSpy.create
          .mustBeCalledWith(fakeRegistrationDetails.user)
          .resolveWith(fakeToken);

        // 7: CREATE LLAMA and connect it
        llamaRemoteServiceSpy.create.mustBeCalledWith(llamaWithUserId);

      });
      Then(() => {
        // 4: then redirect to login
        expect(routerAdapterServiceSpy.goToUrl).toHaveBeenCalledWith(`${appRoutesNames.LOGIN}`);
      });
    });

  });
});
