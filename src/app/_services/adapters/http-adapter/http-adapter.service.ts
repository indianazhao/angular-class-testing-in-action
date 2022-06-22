import { UserCredentials } from './../../../_types/user-credentials.type';
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

  patch<T>(url: string, body: any): Promise<T> {
    return this.httpClient.patch<T>(url, body).toPromise();
  }

  // TODO: TEST
  post<T>(url: string, body: any): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
