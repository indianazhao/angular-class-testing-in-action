import { FrontService } from './front.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Llama } from '../_types/llama.type';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

describe('FrontService', () => {

  let serviceUnderTest: FrontService;
  let llamaRemoteServiceSpy: Spy<LlamaRemoteService>;
  let fakeLlamas: Llama[];
  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        FrontService,
        {provide: LlamaRemoteService, useValue: createSpyFromClass(LlamaRemoteService)}
      ]
    });

    serviceUnderTest = TestBed.get(FrontService);
    llamaRemoteServiceSpy = TestBed.get(LlamaRemoteService);

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

});
