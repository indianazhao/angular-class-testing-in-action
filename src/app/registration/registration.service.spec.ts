import { RegistrationDetails } from './../_types/registration-details.type';
import { appRoutesNames } from './../app.routes.names';
import { TestBed, fakeAsync } from '@angular/core/testing';
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

  describe('METHOD: registerNewUser', () => {
    let fakeRegistrationDetails: RegistrationDetails;

    When(fakeAsync(() => {
      serviceUnderTest.registerNewUser(fakeRegistrationDetails);
    }));

    describe('GIVEN user and llama created successfully THEN then redirect to login', () => {
      Given(() => {
        // user and llama created successfully
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

        // ?????????????????? (????????? token ???????????? user id ???)???????????? userRemoveService ????????? token ?????? user id
        const returnedUserId: number = 12345;

        // CREATE USER -> create UserRemoteService (?????? LlamaRemoteService)
        userRemoteServiceSpy.create
          .mustBeCalledWith(fakeRegistrationDetails.user)
          .resolveWith(returnedUserId);

        const llamaWithUserId = {
          ...fakeRegistrationDetails.llama,
          userId: returnedUserId,
        };

        // CREATE LLAMA and connect it (?????? llama [?????? + ?????????] ?????? user id ??? llama ????????????)
        llamaRemoteServiceSpy.create
          .mustBeCalledWith(llamaWithUserId)
          .resolveWith();

      });
      Then(() => {
        // then redirect to login
        expect(routerAdapterServiceSpy.goToUrl).toHaveBeenCalledWith(`/${appRoutesNames.LOGIN}`);
      });
    });

  });
});
