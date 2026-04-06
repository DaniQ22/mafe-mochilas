import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

const TOKEN_KEY = 'admin_token';
const API_BASE = 'https://mochilasmafe-back.onrender.com';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) { }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${API_BASE}/api/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap(({ token }) => {
          localStorage.setItem(TOKEN_KEY, token);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
