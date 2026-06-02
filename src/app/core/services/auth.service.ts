import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { ENDPOINTS } from './api/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    return this.api.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
  }

  saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
  }

}