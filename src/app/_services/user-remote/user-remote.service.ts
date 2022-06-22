import { Injectable } from '@angular/core';
import { UserCredentials } from 'src/app/_types/user-credentials.type';
import { HttpAdapterService } from '../adapters/http-adapter/http-adapter.service';

export const USER_REMOTE_PATH = '/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserRemoteService {

  constructor(
    private httpAdapterService: HttpAdapterService,
  ) { }

  // TODO: TEST
  // 因為 json-server 使用的 resource id 是 number，所以這邊原本是 token string，改成 user id number
  async create(credentials: UserCredentials): Promise<number> {
    // 必須給 post<T> 加上正確的型別 T，否則後面掉用 tokenHolder.accessToken 會錯誤
    const tokenHolder = await this.httpAdapterService
      .post<{ accessToken: string }>(USER_REMOTE_PATH, credentials);

    const userId = this.getUserIdFromToken(tokenHolder.accessToken);
    return userId;
  }

  private getUserIdFromToken(token: string): number {
    // 從 accessToken 取得 payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;
    return userId;
  }
}
