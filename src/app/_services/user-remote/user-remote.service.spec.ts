import { appRoutesNames } from './../../app.routes.names';
import { UserCredentials } from './../../_types/user-credentials.type';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { HttpAdapterService } from '../adapters/http-adapter/http-adapter.service';
import { UserRemoteService, USER_REMOTE_PATH } from './user-remote.service';

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

    // 使用 jwt.io 建立一個回來用，不需要去處理 JWT 的問題 (這應該是後端要負責的部份)
    const accessTokenWithUserIdOf2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5hbWUiOiJGQUtFIFVTRVIiLCJpYXQiOjE1MTYyMzkwMjJ9.R51Wh-iafjESs9CI45tDVlBHEwSaWhwBcZqwH8NVw50';
    const expectedUserId = 2;

    When(fakeAsync(async () => {
      actualResult = await serviceUnderTest.create(fakeCredentials);
    }));

    describe('GIVEN user created successfully THEN return user id', () => {
      Given(() => {
        fakeCredentials = {
          email: 'fake@fake.com',
          password: 'FAKE PASSWORD',
        };

        const expectedUrl = USER_REMOTE_PATH;

        httpAdapterServiceSpy.post
          .mustBeCalledWith(expectedUrl, fakeCredentials)
          .resolveWith({
            accessToken: accessTokenWithUserIdOf2,
          });

        });
      Then(() => {
        expect(actualResult).toEqual(expectedUserId);
      });
    });

  });
});
