import { Injectable } from '@angular/core';
import { UserCredentials } from 'src/app/_types/user-credentials.type';

@Injectable({
  providedIn: 'root'
})
export class UserRemoteService {

  constructor() { }

  // TODO: TEST
  create(credentials: UserCredentials): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
