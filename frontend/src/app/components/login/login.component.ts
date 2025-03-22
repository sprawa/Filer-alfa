import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loginFailed = false;
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  onSubmit() {
    if (!this.username || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'end'
      });
      return;
    }

    this.loading = true;
    this.loginFailed = false;

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

          this.snackBar.open('Login successful', 'Close', {
            duration: 2000,
            horizontalPosition: 'end'
          });

          // Redirect to the home page or another appropriate route
          this.router.navigate(['/files']);
        } else {
          this.loginFailed = true;
          this.snackBar.open('Login failed: Token not found', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
          console.error('Token not found in response header');
        }
        this.loading = false;
      },
      error: (error) => {
        // Handle login error
        console.error('Login failed', error);
        this.loginFailed = true;
        this.loading = false;
        this.snackBar.open('Login failed: Invalid credentials', 'Close', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      }
    });
  }
}
