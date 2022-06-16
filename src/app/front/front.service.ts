import { Injectable } from '@angular/core';
import { Llama } from '../_types/llama.type';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';

@Injectable({
  providedIn: 'root'
})
export class FrontService {
  constructor(private llamaRemoteService: LlamaRemoteService) {}

  getFeaturedLlamas(config?: any): Promise<Llama[]> {

    return this.llamaRemoteService.getLlamasFromServer().toPromise();
  }

  // TODO: TEST
  pokeLlama(llama: Llama) {
    throw new Error('Method not implemented.');
  }
}
