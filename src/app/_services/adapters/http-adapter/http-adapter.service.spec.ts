import { HttpClientModule } from '@angular/common/http';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Spy } from 'jasmine-auto-spies';
import { HttpAdapterService } from './http-adapter.service';

import serverMock from 'xhr-mock';

describe('HttpAdapterService', () => {
  let serviceUnderTest: HttpAdapterService;
  let actualResult: any;
  let expectedReturnedResult: any;
  let actualBodySent: any;
  let fakeUrlArg: string;
  let fakeBodyArg: any;

  Given(() => {
    TestBed.configureTestingModule({
      imports: [
        // 因為 HttpAdapterService 使用了 HttpClient
        HttpClientModule,
      ],
      providers: [
        HttpAdapterService,
      ]
    });

    serviceUnderTest = TestBed.inject(HttpAdapterService);
    actualResult = undefined;
    expectedReturnedResult = undefined;
    actualBodySent = undefined;
    fakeUrlArg = undefined;
    fakeBodyArg = undefined;

    // 初始化 xhr-mock (假 server)
    serverMock.setup();
  });

  afterEach(() => {
    // 除了 Angular 以外的第三方 lib，都可能需要在每次測試後自己手動 reset
    serverMock.teardown();
  });

  describe('METHOD: patch', () => {
    Given(() => {
      fakeUrlArg = '/fake';
      fakeBodyArg = {
        fake: 'body',
      };
      expectedReturnedResult = {
        fake: 'result',
      };

      // 建立一個假的 server
      // 所以有了這個 contract test (只要我們的邏輯符合這個規格)，我們可以不需要在 HttpAdapterService 裡頭使用 HttpClient，可以置換任意的 http 服務！
      serverMock.patch(fakeUrlArg, (request, response) => {
        actualBodySent = JSON.parse(request.body());
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    When(fakeAsync(async () => {
      actualResult = await serviceUnderTest.patch(fakeUrlArg, fakeBodyArg);
    }));

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedResult);
    });
  });

  describe('METHOD: post', () => {
    Given(() => {
      actualBodySent = undefined;
      fakeUrlArg = '/fake';
      fakeBodyArg = {
        fake: 'body'
      };

      expectedReturnedResult = {
        fake: 'result'
      };

      serverMock.post(fakeUrlArg, (request, response) => {
        actualBodySent = JSON.parse(request.body());
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    When(
      fakeAsync(async () => {
        actualResult = await serviceUnderTest.post(fakeUrlArg, fakeBodyArg);
      })
    );

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedResult);
      expect(actualBodySent).toEqual(fakeBodyArg);
    });
  });

  describe('METHOD: get', () => {
    Given(() => {
      fakeUrlArg = '/fake';

      expectedReturnedResult = {
        fake: 'result'
      };

      serverMock.get(fakeUrlArg, (request, response) => {
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    When(
      fakeAsync(() => {
        serviceUnderTest.get(fakeUrlArg).subscribe(result => (actualResult = result));
      })
    );

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedResult);
    });
  });
});
