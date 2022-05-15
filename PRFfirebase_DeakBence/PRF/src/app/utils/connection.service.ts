import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient) { }

  greet() {
    return this.http.get(environment.serverUrl, {responseType: 'text', withCredentials: true}); //aszinkronitas
  }
}
