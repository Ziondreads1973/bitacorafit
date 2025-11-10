import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
    private toastCtrl: ToastController
  ) {}

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

    // Navega a tabs y reemplaza la URL para no volver al login con back
    await this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }
}
