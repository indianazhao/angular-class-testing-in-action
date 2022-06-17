import { Injectable } from '@angular/core';
import { appRoutesNames } from './../app.routes.names';
import { RouterAdapterService } from './../_services/router-adapter/router-adapter.service';
import { Llama } from '../_types/llama.type';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';

@Injectable({
  providedIn: 'root'
})
export class FrontService {

  userLlama: Llama;

  constructor(
    private llamaRemoteService: LlamaRemoteService,
    private routerAdapterService: RouterAdapterService,
  ) {}

  getFeaturedLlamas(config?: any): Promise<Llama[]> {

    return this.llamaRemoteService.getLlamasFromServer().toPromise();
  }

  // TODO: TEST
  pokeLlama(llama: Llama) {

    const userLlamaId = this.userLlama.id;
    const pokeByClone = llama.pokedByTheseLlamas ? llama.pokedByTheseLlamas.slice() : [];
    pokeByClone.push(userLlamaId);

    this.llamaRemoteService.update(llama.id, {
      pokedByTheseLlamas: pokeByClone
    })
  }
}
