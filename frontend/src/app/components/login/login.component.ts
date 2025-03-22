import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loginFailed = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  onSubmit() {
    // Encode username and password
    const encodedUsername = encodeURIComponent(this.username);
    const encodedPassword = encodeURIComponent(this.password);

    // Basic Authentication header
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(encodedUsername + ':' + encodedPassword)
    });

    // Send request to the /user endpoint
    this.http.get('http://localhost:8080/user', { headers, observe: 'response' }).subscribe({
      next: (response: HttpResponse<any>) => {
        // Extract the JWT token from the header
        const token = response.headers.get('Authorization');
        if (token) {
          // Store the token using AuthService
          this.authService.setToken(token);

          // Redirect to the home page or another appropriate route
          this.router.navigate(['/home']);
        } else {
          this.loginFailed = true;
          console.error('Token not found in response header');
        }
      },
      error: (error) => {
        // Handle login error
        console.error('Login failed', error);
        this.loginFailed = true;
      }
    });
  }
}
