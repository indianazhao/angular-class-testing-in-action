import { HttpAdapterService } from './../adapters/http-adapter/http-adapter.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Llama } from '../../_types/llama.type';

export const LLAMAS_REMOTE_PATH = '/api/llamas';
@Injectable({
  providedIn: 'root'
})
export class LlamaRemoteService {
  constructor(
    private http: HttpClient,
    private httpAdapterService: HttpAdapterService,
  ) {

  }

  // TODO: change url to /llama AND change to Adapter
  getLlamasFromServer(): Observable<Llama[]> {
    return this.http.get<Llama[]>('/api/newestLlamas');
  }

  update(llamaId: string, changes: Partial<Llama>): Promise<Llama> {
    const url = `${LLAMAS_REMOTE_PATH}/${llamaId}`;
    return this.httpAdapterService.patch(url, changes);
  }

  // TODO: TEST
  create(basicLlamaDetails: Partial<Llama>): Promise<Llama> {
    throw new Error('Method not implemented.');
  }
}
