import { LlamaStateService } from './llama-state.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Llama } from '../../_types/llama.type';
import { LlamaRemoteService } from '../llama-remote/llama-remote.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { appRoutesNames } from '../../app.routes.names';
import { RouterAdapterService } from '../adapters/router-adapter/router-adapter.service';
import { QueryConfig } from './../../_types/query-config.type';
import { ObserverSpy } from '@hirez_io/observer-spy';

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
    let observerSpy: ObserverSpy<Llama[]>;

    Given(() => {
      observerSpy = new ObserverSpy();

      expectedQueryConfig = {
        filters: {
          featured: true
        }
      };
    });

    // 測試「觸發 mutation subject」的行為 (test link of this.mutationSubject.pipe)
    describe(`GIVEN requests return successfully
              WHEN subscribing AND triggering mutation subject once
              THEN receive 2 output results`, () => {
      Given(() => {
        // 不需要回傳 fake llamas 等內容，因為在最小化其他非測試區塊的原則下，我們不太關心回傳內容。
        llamaRemoteServiceSpy.getMany.and.nextWith();
      });

      When(() => {
        // actualResult = value 只會保留最後一次結果，所以要把 subscribe 內容改成 observerSpy，才能觀察 observable「所有」變化。
        const sub = serviceUnderTest.getFeaturedLlamas$().subscribe(observerSpy);

        // 觸發行為
        serviceUnderTest['mutationSubject'].next();

        // 養成好習慣，永遠要在 When 裡頭 unsubscribe subscription。
        sub.unsubscribe();
      });

      Then(() => {
        // 在最小化其他非測試區塊的原則下，我們不太關心回傳內容。這裡我們只在乎收到 2 次輸出結果 (給值)。
        /**
         *  注意！這裡的 getValuesLength 為何會是 2？不是回傳的 llamas 陣列有兩個元素，而是 mutationSubject 會被「給值」2 次！
         *  第一次是被訂閱時：const sub = serviceUnderTest.getFeaturedLlamas$().subscribe(observerSpy);
         *  第二次是被 next 時：serviceUnderTest['mutationSubject'].next();
         *  所以仔細檢查 observerSpy.getValues() 時，會看到陣列裡塞了兩個空值 [null, null]，因為我們在 Given() 裡給的是空 llamas。
         *  如果我們再呼叫一次 next，就會有三個空值 [null, null, null]，這時 getValuesLength() 就是 3。
         *  describe 裡頭的「2 output results」，就是兩個輸出結果的意思！
         */
        expect(observerSpy.getValuesLength()).toBe(2);
      });
    });

    describe(`GIVEN llamas loaded successfully from server
              WHEN subscribing
              THEN return them`, () => {
      Given(() => {
        fakeLlamas = [{ id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        llamaRemoteServiceSpy.getMany
          .mustBeCalledWith(expectedQueryConfig)
          .nextOneTimeWith(fakeLlamas);
      });

      When(() => {
        serviceUnderTest.getFeaturedLlamas$().subscribe(value => (actualResult = value));
      });

      Then(() => {
        expect(actualResult).toEqual(fakeLlamas);
      });
    });

    describe(`GIVEN loaded llama is poked by user
              WHEN subscribing
              THEN decorate with isPoked`, () => {
      const fakeUserLlamaId = 'FAKE USER LLAMA ID';

      Given(() => {
        // userLlama id inside the pokedByTheseLlamas of the returned llama
        const fakePokedLlama = createDefaultFakeLlama();
        fakePokedLlama.pokedByTheseLlamas = [fakeUserLlamaId];
        fakeLlamas = [fakePokedLlama];

        // 需要去設定 serviceUnderTest 裡的 userLlamaSubject，才能讓其他函式知道目前的 user llama id
        setupAndEmitUserLlamaWithId(fakeUserLlamaId);

        llamaRemoteServiceSpy.getMany
          .mustBeCalledWith(expectedQueryConfig)
          .nextOneTimeWith(fakeLlamas);
      });

      When(() => {
        serviceUnderTest.getFeaturedLlamas$().subscribe(value => (actualResult = value));
      });

      Then(() => {
        const expectedPokedLlama: Llama = actualResult[0];
        expect(expectedPokedLlama.isPoked).toBe(true);
      });
    });

  });

  describe('METHOD: pokeLlama', () => {
    let fakeUserLlamaId: string;
    let fakeLlama: Llama;

    When(fakeAsync(async () => {
      serviceUnderTest.pokeLlama(fakeLlama);
    }));

    describe('GIVEN user llama exists', () => {

      let mutationNextSpy: jasmine.Spy;

      Given(() => {
        mutationNextSpy = jasmine.createSpy('mutationNext');
        serviceUnderTest['mutationSubject'].next = mutationNextSpy;

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

          expect(mutationNextSpy).toHaveBeenCalled();
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

          expect(mutationNextSpy).toHaveBeenCalled();
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
