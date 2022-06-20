import { HttpClientModule } from '@angular/common/http';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Spy } from 'jasmine-auto-spies';
import { HttpAdapterService } from './http-adapter.service';

// 8
import serverMock from 'xhr-mock';

describe('HttpAdapterService', () => {
  let serviceUnderTest: Spy<HttpAdapterService>;
  let actualResult: any;

  // 1
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

    serviceUnderTest = TestBed.inject<any>(HttpAdapterService);
    actualResult = undefined;

    // 9: 初始化 xhr-mock (假 server)
    serverMock.setup();
  });

  // 10
  afterEach(() => {
    // 除了 Angular 以外的第三方 lib，都可能需要在每次測試後自己手動 reset
    serverMock.teardown();
  });

  // 2
  describe('METHOD: patch', () => {

    // 6
    let fakeUrlArg: string;
    let fakeBodyArg: any;
    let expectedReturnedResult: any;

    // 12
    let actualBodySent: any;

    // 5
    Given(() => {

      // 7
      fakeUrlArg = '/fake';
      fakeBodyArg = {
        fake: 'body',
      };
      expectedReturnedResult = {
        fake: 'result',
      };

      // 11: 建立一個假的 server
      // 所以有了這個 contact test (只要我們的邏輯符合這個規格)，我們可以不需要在 HttpAdapterService 裡頭使用 HttpClient，可以置換任意的 http 服務！
      serverMock.patch(fakeUrlArg, (request, response) => {
        actualBodySent = JSON.parse(request.body());
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    // 3
    When(fakeAsync(async () => {
      actualResult = await serviceUnderTest.patch(fakeUrlArg, fakeBodyArg);
    }));

    // 4
    Then(() => {
      expect(actualResult).toEqual(expectedReturnedResult);
    });

  });

});
