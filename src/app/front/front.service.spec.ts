import { appRoutesNames } from './../app.routes.names';
import { FrontService } from './front.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { Llama } from '../_types/llama.type';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';
import { RouterAdapterService } from '../_services/adapters/router-adapter/router-adapter.service';

describe('FrontService', () => {

  let serviceUnderTest: FrontService;
  let llamaRemoteServiceSpy: Spy<LlamaRemoteService>;
  let routerAdapterServiceSpy: Spy<RouterAdapterService>;
  let fakeLlamas: Llama[];
  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        FrontService,
        {provide: LlamaRemoteService, useValue: createSpyFromClass(LlamaRemoteService)},
        {provide: RouterAdapterService, useValue: createSpyFromClass(RouterAdapterService)},
      ]
    });

    serviceUnderTest = TestBed.inject(FrontService);
    llamaRemoteServiceSpy = TestBed.inject<any>(LlamaRemoteService);
    routerAdapterServiceSpy = TestBed.inject<any>(RouterAdapterService);

    fakeLlamas = undefined;
    actualResult = undefined;
  });

  describe('METHOD: getFeaturedLlamas', () => {

    Given(() => {
      fakeLlamas = [{ id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
      llamaRemoteServiceSpy.getLlamasFromServer.and.nextOneTimeWith(fakeLlamas);
    });

    When(fakeAsync( async () => {
      actualResult = await serviceUnderTest.getFeaturedLlamas();
    }));

    Then(() => {
      expect(actualResult).toEqual(fakeLlamas);
    });


  });

  describe('METHOD: pokeLlama', () => {
    let fakeUserLlamaId: string;
    let fakeLlama: Llama;

    When(() => {
      serviceUnderTest.pokeLlama(fakeLlama);
    });

    describe('GIVEN user llama is empty THEN redirect to login', () => {
      Given(() => {
        serviceUnderTest.userLlama = null;
      });

      Then(() => {
        expect(routerAdapterServiceSpy.goToUrl).toHaveBeenCalledWith(`/${appRoutesNames.LOGIN}`);
      });
    });

    describe('GIVEN user llama exists', () => {
      // 把測試條件裡共通的 Given 內容抽出來
      Given(() => {
        serviceUnderTest.userLlama = createDefaultFakeLlama();
        fakeUserLlamaId = 'FAKE LLAMA USER ID';
        serviceUnderTest.userLlama.id = fakeUserLlamaId;
      });

      describe('GIVEN llama with an empty pokeBy list THEN add user llama to the list', () => {
        Given(() => {
          fakeLlama = createDefaultFakeLlama();
        });

        Then(() => {
          const expectedChanges: Partial<Llama> = {
            pokedByTheseLlamas: [fakeUserLlamaId],
          };
          expect(llamaRemoteServiceSpy.update).toHaveBeenCalledWith(fakeLlama.id, expectedChanges);
        });
      });

      describe('GIVEN llama with a filled pokeBy list THEN add user llama to the list', () => {
        Given(() => {
          fakeLlama = createDefaultFakeLlama();
          fakeLlama.pokedByTheseLlamas = ['ANOTHER FAKE ID'];
        });

        Then(() => {
          const expectedChanges: Partial<Llama> = {
            pokedByTheseLlamas: ['ANOTHER FAKE ID', fakeUserLlamaId],
          };
          expect(llamaRemoteServiceSpy.update).toHaveBeenCalledWith(fakeLlama.id, expectedChanges);
        });
      });
    });


  });

});

// 為什麼從 front.component.spec.ts 複製這個函式？而不是把它抽離出來讓其他測試檔案共用？作者認為這樣可以保持簡單，而且可以讓各自測試進行客製。
function createDefaultFakeLlama() {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
