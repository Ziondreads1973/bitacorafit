import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  // Si ya está autenticado, no tiene sentido mostrar el login
  async ionViewWillEnter() {
    if (this.authService.isAuthenticated()) {
      const redirect = this.authService.consumeRedirectUrl();
      if (redirect) {
        await this.router.navigateByUrl(redirect, { replaceUrl: true });
      } else {
        await this.router.navigateByUrl('/tabs', { replaceUrl: true });
      }
    }
  }

  async enter() {
    const value = this.email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!valid) {
      const t = await this.toastCtrl.create({
        message: 'Please enter a valid email',
        duration: 1800,
        position: 'bottom',
        color: 'warning',
      });
      return t.present();
    }

    // Marcamos la sesión como iniciada en AuthService + Storage
    // Como tu login solo usa email, le pasamos un password dummy
    const ok = await this.authService.login(value, 'dummy');

    if (!ok) {
      const t = await this.toastCtrl.create({
        message: 'Login error, please try again',
        duration: 1800,
        position: 'bottom',
        color: 'danger',
      });
      return t.present();
    }

    // 👇 Si venías de una URL protegida (por ejemplo /measure/weight-detail),
    // volvemos exactamente ahí. Si no, vamos al flujo normal de tabs.
    const redirect = this.authService.consumeRedirectUrl();

    if (redirect) {
      await this.router.navigateByUrl(redirect, { replaceUrl: true });
    } else {
      await this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  }
}
