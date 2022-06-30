import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, interval, merge } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { produce } from 'immer';
import { Llama } from '../../_types/llama.type';
import { LlamaRemoteService } from '../llama-remote/llama-remote.service';
import { RouterAdapterService } from '../adapters/router-adapter/router-adapter.service';
import { appRoutesNames } from '../../app.routes.names';

@Injectable({
  providedIn: 'root'
})
export class LlamaStateService {

  private userLlamaSubject: BehaviorSubject<Llama> = new BehaviorSubject(null);
  private mutationSubject: BehaviorSubject<void> = new BehaviorSubject(null);

  constructor(
    private llamaRemoteService: LlamaRemoteService,
    private routerAdapterService: RouterAdapterService
  ) { }

  // 由於更多地方需要取得 Llama 資訊 (ex: front, login,...) 所以我們把 getFeaturedLlamas(), pokeLlama() 從 front service 重構至這個 LlamaStateService

  private decorateWithIsPoked(llamas: Llama[]): Llama[] {
    const newLlamasCopy: Llama[] = produce(llamas, llamasDraft => {
      const userLlama = this.userLlamaSubject.getValue();
      if (!userLlama) {
        return;
      }
      llamasDraft.forEach(llama => {
        if (llama.pokedByTheseLlamas && llama.pokedByTheseLlamas.length > 0) {
          const indexOfUserLlamaId = llama.pokedByTheseLlamas.indexOf(userLlama.id);
          llama.isPoked = indexOfUserLlamaId !== -1;
        }
      });
    });
    return newLlamasCopy;
  }

  getFeaturedLlamas$(): Observable<Llama[]> {
    // 除了 mutationSubject (按下 poke 會觸發撈資料) 外，我們 merge 了另一個會定時觸發的 observable，每隔一段時間就會去撈資料。
    return merge(
      this.mutationSubject,
      interval(5000)
    ).pipe(
      switchMap(_ =>
        this.llamaRemoteService.getMany({
          filters: {
            featured: true
          }
        })
      ),
      map(llamas => this.decorateWithIsPoked(llamas))
    );
  }

  // TODO: Handle Errors?
  async pokeLlama(llama: Llama) {
    const userLlama = this.userLlamaSubject.getValue();
    if (!userLlama) {
      this.routerAdapterService.goToUrl(`/${appRoutesNames.LOGIN}`);
      return;
    }

    const pokedByClone = llama.pokedByTheseLlamas ? [...llama.pokedByTheseLlamas] : [];
    pokedByClone.push(userLlama.id);

    await this.llamaRemoteService.update(llama.id, {
      pokedByTheseLlamas: pokedByClone
    });

    this.mutationSubject.next();
  }

  getUserLlama$(): Observable<Llama> {
    return this.userLlamaSubject.asObservable();
  }

  async loadUserLlama(userId: number): Promise<void> {
    const userLlama = await this.llamaRemoteService.getByUserId(userId).toPromise();
    this.userLlamaSubject.next(userLlama);
  }
}
