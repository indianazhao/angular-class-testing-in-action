import { appRoutesNames } from './../../app.routes.names';
import { UserCredentials } from './../../_types/user-credentials.type';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { HttpAdapterService } from '../adapters/http-adapter/http-adapter.service';
import { UserRemoteService, USER_REMOTE_PATH } from './user-remote.service';

// 這邊我們不如下直接 import 函式，而是透過 import * as 的方式把它包含在某個物件之下 (就像一個容器包含這個函式)，這樣我們就可以使用一個 spy (or mock) 去取代這個函式
// import { getUserIdFromToken } from './get-user-id-from-token';
import * as jwtDecoder from './get-user-id-from-token';

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

        // 為了避免 getUserIdFromToken 破壞 isolation，必須進行 spy (mock) 測試！
        spyOn(jwtDecoder, 'getUserIdFromToken')
          .withArgs(accessTokenWithUserIdOf2)
          .and.returnValue(expectedUserId);
      });

      Then(() => {
        expect(actualResult).toEqual(expectedUserId);
      });
    });

  });
});
