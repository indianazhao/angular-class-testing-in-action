import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Llama } from 'src/app/_types/llama.type';

@Injectable({
  providedIn: 'root'
})
export class HttpAdapterService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  patch<T>(url: string, changes: Partial<Llama>): Promise<T> {
    return this.httpClient.patch<T>(url, changes).toPromise();
  }
}
