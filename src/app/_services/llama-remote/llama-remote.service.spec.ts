import { TestBed, fakeAsync } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { LlamaRemoteService, LLAMAS_REMOTE_PATH } from './llama-remote.service';
import { HttpAdapterService } from './../adapters/http-adapter/http-adapter.service';
import { Llama } from '../../_types/llama.type';
import { QueryConfig } from 'src/app/_types/query-config.type';

describe('LlamaRemoteService', () => {
  let serviceUnderTest: LlamaRemoteService;
  let httpAdapterServiceSpy: Spy<HttpAdapterService>;
  let fakeLlamas: Llama[];
  let actualResult: any;
  let actualError: any;
  let expectedReturnedLlama: Llama;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LlamaRemoteService,
        { provide: HttpAdapterService, useValue: createSpyFromClass(HttpAdapterService) },
      ]
    });

    serviceUnderTest = TestBed.inject(LlamaRemoteService);
    httpAdapterServiceSpy = TestBed.inject<any>(HttpAdapterService);

    fakeLlamas = undefined;
    actualResult = undefined;
    actualError = undefined;
    expectedReturnedLlama = undefined;
  });

  describe('METHOD: getMany', () => {

    let queryConfig: QueryConfig;

    When(() => {
      serviceUnderTest.getMany(queryConfig).subscribe(value => (actualResult = value));
    });

    describe('GIVEN no config THEN call the default url return the llamas', () => {
      Given(() => {
        fakeLlamas = [{ id: 'fake id', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        queryConfig = null;

        httpAdapterServiceSpy.get
          .mustBeCalledWith(LLAMAS_REMOTE_PATH)
          .nextOneTimeWith(fakeLlamas);
      });
      Then(() => {
        expect(actualResult).toEqual(fakeLlamas);
      });
    });

    describe('GIVEN config with filters THEN call the url with query params return the llamas', () => {
      Given(() => {
        fakeLlamas = [{ id: 'fake id', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        queryConfig = {
          filters: {
            featured: true
          }
        };
        const expectedUrl = LLAMAS_REMOTE_PATH + '?featured=true';

        httpAdapterServiceSpy.get
          .mustBeCalledWith(expectedUrl)
          .nextOneTimeWith(fakeLlamas);
      });
      Then(() => {
        expect(actualResult).toEqual(fakeLlamas);
      });
    });
  });

  describe('METHOD: update', () => {

    let fakeLlamaIdArg: string;
    let fakeLlamaChangesArg: Partial<Llama>;
    let errorIsExpected: boolean;

    Given(() => {
      errorIsExpected = false;
    });

    When(fakeAsync(async () => {
      try {
        actualResult = await serviceUnderTest.update(fakeLlamaIdArg, fakeLlamaChangesArg);
      } catch (error) {
        if (!errorIsExpected) {
          throw error;
        }
        actualError = error;
      }
    }));

    describe('GIVEN update was successful THEN return the updated llama', () => {

      Given(() => {
        // 資料從 front.service.spec.ts 複製出來...
        fakeLlamaIdArg = 'FAKE ID';
        fakeLlamaChangesArg = {
          pokedByTheseLlamas: ['FAKE USER LLAMA ID'],
        };

        expectedReturnedLlama = createDefaultFakeLlama();

        // TODO: 目前這兩行沒加也無所謂，因為 expect 那邊也會成立。之後等 http adapter 的 patch 實作後，來看看不加上這兩行是否會出錯。
        expectedReturnedLlama.id = fakeLlamaIdArg;
        expectedReturnedLlama.pokedByTheseLlamas = ['FAKE USER LLAMA ID'];

        const expectedUrl = `${LLAMAS_REMOTE_PATH}/${fakeLlamaIdArg}`;
        httpAdapterServiceSpy.patch
          .mustBeCalledWith(expectedUrl, fakeLlamaChangesArg)
          .resolveWith(expectedReturnedLlama);
      });

      Then(() => {
        expect(actualResult).toEqual(expectedReturnedLlama);
      });
    });


    describe('GIVEN update failed THEN rethrow the error', () => {
      Given(() => {
        errorIsExpected = true;

        // 因為給 patch 方法加上回傳為 Promise<T> 型別，所以可以使用 rejectWith()
        httpAdapterServiceSpy.patch.and.rejectWith('FAKE ERROR');
      });

      Then(() => {
        expect(actualError).toEqual('FAKE ERROR');
      });
    });
  });

  describe('METHOD: create', () => {
    let fakeBasicLlamaDetails: Partial<Llama>;

    Given(() => {
      fakeBasicLlamaDetails = {
        name: 'FAKE NAME',
        imageFileName: 'FAKE IMAGE FILE NAME',
        userId: 333333
      };

      expectedReturnedLlama = {
        ...expectedReturnedLlama,
        id: 'FAKE ID',
        ...fakeBasicLlamaDetails
      };

      httpAdapterServiceSpy.post
        .mustBeCalledWith(LLAMAS_REMOTE_PATH, fakeBasicLlamaDetails)
        .resolveWith(expectedReturnedLlama);
    });

    When(fakeAsync(async () => {
      actualResult = await serviceUnderTest.create(fakeBasicLlamaDetails);
    }));

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedLlama);
    });

  });

  describe('METHOD: getByUserId', () => {
    let fakeUserId: number;
    let expectedReturnedUserLlama: Llama;

    Given(() => {
      fakeUserId = 33333333;

      expectedReturnedUserLlama = createDefaultFakeLlama();
      expectedReturnedUserLlama.userId = fakeUserId;

      const url = LLAMAS_REMOTE_PATH + '?userId=' + fakeUserId;

      httpAdapterServiceSpy.get.mustBeCalledWith(url)
        .nextOneTimeWith([expectedReturnedUserLlama]);
    });

    When(() => {
      serviceUnderTest.getByUserId(fakeUserId)
        .subscribe(result => actualResult = result);
    });

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedUserLlama);
    });

  });
});

function createDefaultFakeLlama() {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
