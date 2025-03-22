import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) { }

  register() {
    this.errorMessage = ''; // Clear previous errors
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      console.log('Validation error:', this.errorMessage);
      return;
    }

    this.userService.registerUser(this.email, this.password).subscribe({
      next: (response: any) => {
        // Registration successful
        console.log('Registration successful', response);
        this.router.navigate(['/home']); // Redirect to home page after successful registration
      },
      error: (error: any) => {
        // Registration failed
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed: ' + error.message;
         console.log('API error:', error);
      }
    });
  }
}
