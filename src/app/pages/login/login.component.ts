import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  error: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    if (this.isLoading) return;

    this.error = null;
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        void this.router.navigate(['/gestion-interna']);
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos.';
        this.isLoading = false;
      },
    });
  }
}
