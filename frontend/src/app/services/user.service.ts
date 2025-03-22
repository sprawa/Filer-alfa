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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { email: email, password: password }; // Create the request body
    return this.http.post(this.registrationUrl, body, { headers: headers, withCredentials: true });
  }

  // Function to get the token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Function to create headers with the JWT token
  createAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  getFiles(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get('http://localhost:8080/files', { headers: headers });
  }
}
