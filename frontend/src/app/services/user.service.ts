import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private registrationUrl = 'http://localhost:8080/user/registration'; // Backend registration endpoint

  constructor(private http: HttpClient) { }

  registerUser(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email: email, password: password }; // Create the request body
    return this.http.post(this.registrationUrl, body, { headers: headers });
  }
}
