import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { appRoutesNames } from './../app.routes.names';
import { Llama } from '../_types/llama.type';
import { LlamaStateService } from '../_services/llama-state/llama-state.service';

@Component({
  selector: 'ld-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {

  llamaPageLink = `/${appRoutesNames.LLAMA_PAGE}`;
  showErrorMessage: boolean;
  featuredLlamas$: Observable<Llama[]>;

  constructor(
    private llamaStateService: LlamaStateService
  ) { }

  ngOnInit() {
    this.featuredLlamas$ = this.llamaStateService.getFeaturedLlamas$();
  }

  isListVisible(llamas: Llama[]): boolean {
    return !!llamas && llamas.length > 0;
  }

  // TODO: handle errors?
  poke(llama: Llama) {
    this.llamaStateService.pokeLlama(llama);
  }

}
