import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from './endpoints';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get(url: string) {
    return this.http.get(`${this.baseUrl}${url}`);
  }

  getAuth(url: string) {

    const token = localStorage.getItem('token');

    return this.http.get(`${this.baseUrl}${url}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  postAuth(url: string, body: any) {
  const token = localStorage.getItem('token');
  return this.http.post(`${this.baseUrl}${url}`, body, {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  });
}

  post(url: string, body: any) {
    return this.http.post(`${this.baseUrl}${url}`, body);
  }

  put(url: string, body: any) {
    return this.http.put(`${this.baseUrl}${url}`, body);
  }

  delete(url: string) {
    return this.http.delete(`${this.baseUrl}${url}`);
  }

  getTrips() {
    return this.getAuth(ENDPOINTS.TRIPS.LIST);
  }

  putAuth(url: string, body: any) {
  const token = localStorage.getItem('token');
  return this.http.put(`${this.baseUrl}${url}`, body, {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  });
}

deleteAuth(url: string) {
  const token = localStorage.getItem('token');
  return this.http.delete(`${this.baseUrl}${url}`, {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  });
}
}