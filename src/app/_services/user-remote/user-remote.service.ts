import { Injectable } from '@angular/core';
import { UserCredentials } from 'src/app/_types/user-credentials.type';

@Injectable({
  providedIn: 'root'
})
export class UserRemoteService {

  constructor() { }

  // TODO: TEST
  // 因為 json-server 使用的 resource id 是 number，所以這邊原本是 token string，改成 user id number
  create(credentials: UserCredentials): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
