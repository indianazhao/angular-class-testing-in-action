import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { LlamaRemoteService, LLAMAS_REMOTE_PATH } from './llama-remote.service';
import { HttpAdapterService } from './../adapters/http-adapter/http-adapter.service';
import { Llama } from '../../_types/llama.type';

describe('LlamaRemoteService', () => {
  let serviceUnderTest: LlamaRemoteService;
  let httpSpy: Spy<HttpClient>;
  let httpAdapterServiceSpy: Spy<HttpAdapterService>;
  let fakeLlamas: Llama[];
  let actualResult: any;
  let actualError: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LlamaRemoteService,
        { provide: HttpClient, useValue: createSpyFromClass(HttpClient) },
        { provide: HttpAdapterService, useValue: createSpyFromClass(HttpAdapterService) },
      ]
    });

    serviceUnderTest = TestBed.inject(LlamaRemoteService);
    httpSpy = TestBed.inject<any>(HttpClient);
    httpAdapterServiceSpy = TestBed.inject<any>(HttpAdapterService);

    fakeLlamas = undefined;
    actualResult = undefined;
    actualError = undefined;
  });

  describe('METHOD: getLlamasFromServer', () => {

    When(() => {
      serviceUnderTest.getLlamasFromServer().subscribe(value => actualResult = value);
    });

    describe('GIVEN a successful request THEN return the llamas', () => {
      Given(() => {
        fakeLlamas = [{ id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        httpSpy.get.and.nextOneTimeWith(fakeLlamas);

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

    When(fakeAsync(async() => {
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
      let expectedReturnedLlama: Llama;

      Given(() => {
        // 資料從 front.service.spec.ts 複製出來...
        fakeLlamaIdArg = 'FAKE ID';
        fakeLlamaChangesArg = {
          pokedByTheseLlamas: ['FAKE LLAMA USER ID'],
        }

        expectedReturnedLlama = createDefaultFakeLlama();

        // TODO: 目前這兩行沒加也無所謂，因為 expect 那邊也會成立。之後等 http adapter 的 patch 實作後，來看看不加上這兩行是否會出錯。
        expectedReturnedLlama.id = fakeLlamaIdArg;
        expectedReturnedLlama.pokedByTheseLlamas = ['FAKE LLAMA USER ID']

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
});

function createDefaultFakeLlama() {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
