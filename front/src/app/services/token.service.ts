import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  private iss = {
    login: 'http://192.168.33.10/api/login',
    signup: 'http://192.168.33.10/api/signup'
  };

  constructor() { }

  handle(token) {
    this.set(token);
  }

  set(token) {
    localStorage.setItem('access_token', token);
  }
  get() {
    return localStorage.getItem('access_token');
  }

  remove() {
    localStorage.removeItem('access_token');
  }

  isValid() {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }
    return false;
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isValid();
  }
}
