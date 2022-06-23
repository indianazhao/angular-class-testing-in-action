import { Injectable } from '@angular/core';
import { UserCredentials } from 'src/app/_types/user-credentials.type';
import { HttpAdapterService } from '../adapters/http-adapter/http-adapter.service';
import { getUserIdFromToken } from './get-user-id-from-token';
import { API_BASE_URL } from '../api-base-url';

export const USER_REMOTE_PATH = '/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserRemoteService {

  constructor(
    private httpAdapterService: HttpAdapterService,
  ) { }

  // 因為 json-server 使用的 resource id 是 number，所以這邊原本是 token string，改成 user id number
  create(credentials: UserCredentials): Promise<number> {
    // 必須給 post<T> 加上正確的型別 T，否則後面掉用 tokenHolder.accessToken 會錯誤
    return this.httpAdapterService
      .post<{ accessToken: string }>(USER_REMOTE_PATH, credentials)
      .then(({ accessToken }) => getUserIdFromToken(accessToken));
  }

  authenticate(credentials: UserCredentials): Promise<number> {
    return this.httpAdapterService
      .post<{ accessToken: string }>(API_BASE_URL + '/login', credentials)
      .then(({ accessToken }) => getUserIdFromToken(accessToken));
  }
}
