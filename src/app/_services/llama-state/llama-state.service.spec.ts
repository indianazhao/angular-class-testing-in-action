import { LlamaStateService } from './llama-state.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Llama } from '../../_types/llama.type';
import { LlamaRemoteService } from '../llama-remote/llama-remote.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { appRoutesNames } from '../../app.routes.names';
import { RouterAdapterService } from '../adapters/router-adapter/router-adapter.service';
import { QueryConfig } from './../../_types/query-config.type';

describe('LlamaStateService', () => {
  let serviceUnderTest: LlamaStateService;
  let llamaRemoteServiceSpy: Spy<LlamaRemoteService>;
  let routerAdapterServiceSpy: Spy<RouterAdapterService>;
  let fakeLlamas: Llama[];
  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LlamaStateService,
        { provide: LlamaRemoteService, useValue: createSpyFromClass(LlamaRemoteService) },
        {
          provide: RouterAdapterService,
          useValue: createSpyFromClass(RouterAdapterService)
        }
      ]
    });

    serviceUnderTest = TestBed.inject(LlamaStateService);
    llamaRemoteServiceSpy = TestBed.inject<any>(LlamaRemoteService);
    routerAdapterServiceSpy = TestBed.inject<any>(RouterAdapterService);

    fakeLlamas = undefined;
    actualResult = undefined;
  });

  function setupAndEmitUserLlamaWithId(userLlamaId: string) {
    const fakeUserLlama = createDefaultFakeLlama();
    fakeUserLlama.id = userLlamaId;
    // 因為 userLlamaSubject() 是 private function，無法直接調用
    // serviceUnderTest.userLlamaSubject.next(fakeUserLlama);
    // 如果 tslint 出現錯誤，可以加入下面這行
    // tslint:disable-next-line:no-string-literal
    serviceUnderTest['userLlamaSubject'].next(fakeUserLlama);
  }

  describe('METHOD: getFeaturedLlamas$', () => {

    let expectedQueryConfig: QueryConfig;

    Given(() => {
      expectedQueryConfig = {
        filters: {
          featured: true
        }
      };
    });

    When(() => {
      serviceUnderTest.getFeaturedLlamas$().subscribe(value => (actualResult = value));
    });

    describe('GIVEN llamas loaded successfully from server THEN return them', () => {
      Given(() => {
        fakeLlamas = [{ id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        llamaRemoteServiceSpy.getMany
          .mustBeCalledWith(expectedQueryConfig)
          .nextOneTimeWith(fakeLlamas);
      });

      Then(() => {
        expect(actualResult).toEqual(fakeLlamas);
      });
    });

    describe('GIVEN loaded llama is poked by user THEN decorate with isPoked', () => {
      const fakeUserLlamaId = 'FAKE USER LLAMA ID';

      Given(() => {
        // userLlama id inside the pokedByTheseLlamas of the returned llama
        const fakePokedLlama = createDefaultFakeLlama();
        fakePokedLlama.pokedByTheseLlamas = [fakeUserLlamaId];  // 1. 我們只給 fakePokedLlama 指定了屬性 pokedByTheseLlamas
        fakeLlamas = [fakePokedLlama];

        // 3. 我們還需要去設定 serviceUnderTest 裡的 userLlamaSubject，才能讓其他函式知道目前的 user llama id
        setupAndEmitUserLlamaWithId(fakeUserLlamaId);

        llamaRemoteServiceSpy.getMany
          .mustBeCalledWith(expectedQueryConfig)
          .nextOneTimeWith(fakeLlamas);
      });

      Then(() => {
        const expectedPokedLlama: Llama = actualResult[0];  // 回傳的 actualResult[0] 應該就是 fakePokedLlama
        expect(expectedPokedLlama.isPoked).toBe(true);  // 2. 測試目的看看屬性 isPoked 是否會變成 true
      });
    });

  });

  describe('METHOD: pokeLlama', () => {
    let fakeUserLlamaId: string;
    let fakeLlama: Llama;

    When(() => {
      serviceUnderTest.pokeLlama(fakeLlama);
    });

    describe('GIVEN user llama exists', () => {
      Given(() => {
        fakeUserLlamaId = 'FAKE USER LLAMA ID';
        setupAndEmitUserLlamaWithId(fakeUserLlamaId);
      });

      describe('GIVEN llama with a empty pokedBy list THEN add user llama to the list', () => {
        Given(() => {
          fakeLlama = createDefaultFakeLlama();
        });

        Then(() => {
          const expectedChanges: Partial<Llama> = {
            pokedByTheseLlamas: [fakeUserLlamaId]
          };
          expect(llamaRemoteServiceSpy.update).toHaveBeenCalledWith(
            fakeLlama.id,
            expectedChanges
          );
        });
      });

      describe('GIVEN llama with a filled pokedBy list THEN add user llama to the list', () => {
        Given(() => {
          fakeLlama = createDefaultFakeLlama();
          fakeLlama.pokedByTheseLlamas = ['ANOTHER FAKE ID'];
        });

        Then(() => {
          const expectedChanges: Partial<Llama> = {
            pokedByTheseLlamas: ['ANOTHER FAKE ID', fakeUserLlamaId]
          };
          expect(llamaRemoteServiceSpy.update).toHaveBeenCalledWith(
            fakeLlama.id,
            expectedChanges
          );
        });
      });
    });

    describe('GIVEN user llama is empty THEN redirect to login', () => {
      Then(() => {
        expect(routerAdapterServiceSpy.goToUrl).toHaveBeenCalledWith(
          `/${appRoutesNames.LOGIN}`
        );
      });
    });
  });

  describe('METHOD: loadUserLlama', () => {
    let fakeUserId: number;
    let expectedReturnedUserLlama: Llama;
    Given(() => {
      fakeUserId = 33333333;

      expectedReturnedUserLlama = createDefaultFakeLlama();
      expectedReturnedUserLlama.userId = fakeUserId;

      llamaRemoteServiceSpy.getByUserId
        .mustBeCalledWith(fakeUserId)
        .nextOneTimeWith(expectedReturnedUserLlama);

      serviceUnderTest.getUserLlama$().subscribe(result => (actualResult = result));
    });

    When(
      fakeAsync(() => {
        serviceUnderTest.loadUserLlama(fakeUserId);
      })
    );

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedUserLlama);
    });
  });
});

function createDefaultFakeLlama(): Llama {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
