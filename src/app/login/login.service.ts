import { UserCredentials } from './../_types/user-credentials.type';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  // TODO: TEST
  login(credentials: UserCredentials) {
    throw new Error('Method not implemented.');
  }
}
