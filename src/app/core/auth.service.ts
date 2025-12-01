import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage'; // usa tu storage.ts existente en esta misma carpeta

export interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
}

const AUTH_KEY = 'auth_state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState: AuthState = {
    isLoggedIn: false,
    email: null,
  };

  // URL a la que el usuario quería ir antes de ser enviado a /login
  private redirectUrl: string | null = null;

  constructor(private storage: StorageService, private router: Router) {}

  // 👇 Llamaremos a esto al iniciar la app
  async loadSessionFromStorage(): Promise<void> {
    const saved = await this.storage.get<AuthState>(AUTH_KEY);
    if (saved && saved.isLoggedIn) {
      this.authState = saved;
    }
  }

  // 👇 Login simple: solo revisa que haya email y password
  async login(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
      return false;
    }

    this.authState = {
      isLoggedIn: true,
      email,
    };

    await this.storage.set(AUTH_KEY, this.authState);
    return true;
  }

  // 👇 Cerrar sesión
  async logout(): Promise<void> {
    this.authState = {
      isLoggedIn: false,
      email: null,
    };
    await this.storage.remove(AUTH_KEY);
    await this.router.navigate(['/login']);
  }

  // 👇 El guard usa esto
  isAuthenticated(): boolean {
    return this.authState.isLoggedIn;
  }

  getEmail(): string | null {
    return this.authState.email;
  }

  // ===== Manejo de URL de retorno =====

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  consumeRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  }
}
