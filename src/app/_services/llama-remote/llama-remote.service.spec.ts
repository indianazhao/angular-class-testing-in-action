import { TestBed } from '@angular/core/testing';
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

    let fakeLlamaId: string;
    let fakeLlamaChanges: Partial<Llama>;

    Given(() => {
      // 資料從 front.service.spec.ts 複製出來...
      fakeLlamaId = 'FAKE ID';
      fakeLlamaChanges = {
        pokedByTheseLlamas: ['FAKE LLAMA USER ID'],
      }
    });

    When(() => {
      serviceUnderTest.update(fakeLlamaId, fakeLlamaChanges);
    });

    Then(() => {
      const expectedUrl = `${LLAMAS_REMOTE_PATH}/${fakeLlamaId}`;
      expect(httpAdapterServiceSpy.patch).toHaveBeenCalledWith(expectedUrl, fakeLlamaChanges);
    });

  });
});
