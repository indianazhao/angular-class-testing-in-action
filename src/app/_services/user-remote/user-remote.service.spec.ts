import { appRoutesNames } from './../../app.routes.names';
import { UserCredentials } from './../../_types/user-credentials.type';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { HttpAdapterService } from '../adapters/http-adapter/http-adapter.service';
import { UserRemoteService } from './user-remote.service';

describe('UserRemoteService', () => {
  let serviceUnderTest: UserRemoteService;
  let httpAdapterServiceSpy: Spy<HttpAdapterService>;


  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        UserRemoteService,
        { provide: HttpAdapterService, useValue: createSpyFromClass(HttpAdapterService) },
      ],
    });

    serviceUnderTest = TestBed.inject(UserRemoteService);
    httpAdapterServiceSpy = TestBed.inject<any>(HttpAdapterService);

    actualResult = undefined;

  });

  describe('METHOD: create', () => {

    let fakeCredentials: UserCredentials;
    let expectedUserId: number;

    Given(() => {
      expectedUserId = undefined;
    });


    When(fakeAsync(() => {
      actualResult = serviceUnderTest.create(fakeCredentials);
    }));

    describe('GIVEN user created successfully THEN return user id', () => {
      Given(() => {
        // user created successfully

        expectedUserId = 12345;
        fakeCredentials = {
          email: 'fake@fake.com',
          password: 'FAKE PASSWORD',
        };

        const expectedUrl = `/api/user`;

        httpAdapterServiceSpy.post
          .mustBeCalledWith(expectedUrl, fakeCredentials)
          .resolveWith({
            accessToken: 'FAKE TOKEN',
          });

      });
      Then(() => {
        // return user id
        expect(actualResult).toHaveBeenCalledWith(expectedUserId);
      });
    });

  });
});
