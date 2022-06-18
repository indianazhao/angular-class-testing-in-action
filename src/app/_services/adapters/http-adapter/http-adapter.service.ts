import { Injectable } from '@angular/core';
import { Llama } from 'src/app/_types/llama.type';

@Injectable({
  providedIn: 'root'
})
export class HttpAdapterService {

  constructor() { }

  // TODO: TEST
  patch<T>(url: string, changes: Partial<Llama>): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
