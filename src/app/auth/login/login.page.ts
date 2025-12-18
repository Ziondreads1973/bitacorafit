import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  isLoggingIn = false;

  @ViewChild('loginCard', { read: ElementRef })
  loginCard?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private animationCtrl: AnimationController
  ) {}

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

  private async playLoginSuccessAnimation() {
    const el = this.loginCard?.nativeElement;
    if (!el) return;

    const anim = this.animationCtrl
      .create()
      .addElement(el)
      .duration(220)
      .easing('cubic-bezier(0.4, 0.0, 0.2, 1)')
      .fromTo(
        'transform',
        'translateY(0) scale(1)',
        'translateY(-8px) scale(0.98)'
      )
      .fromTo('opacity', '1', '0');

    await anim.play();
  }

  private async playLoginErrorShake() {
    const el = this.loginCard?.nativeElement;
    if (!el) return;

    const shake = this.animationCtrl
      .create()
      .addElement(el)
      .duration(420)
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, transform: 'translateX(0)' },
        { offset: 0.15, transform: 'translateX(-10px)' },
        { offset: 0.3, transform: 'translateX(10px)' },
        { offset: 0.45, transform: 'translateX(-8px)' },
        { offset: 0.6, transform: 'translateX(8px)' },
        { offset: 0.75, transform: 'translateX(-4px)' },
        { offset: 1, transform: 'translateX(0)' },
      ]);

    await shake.play();
  }

  async enter() {
    if (this.isLoggingIn) return;

    const email = this.email.trim();
    const password = this.password;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      await this.playLoginErrorShake();
      const t = await this.toastCtrl.create({
        message: 'Please enter a valid email',
        duration: 1800,
        position: 'bottom',
        color: 'warning',
      });
      return t.present();
    }

    if (!password || password.trim().length < 3) {
      await this.playLoginErrorShake();
      const t = await this.toastCtrl.create({
        message: 'Please enter a password (min 3 chars)',
        duration: 1800,
        position: 'bottom',
        color: 'warning',
      });
      return t.present();
    }

    this.isLoggingIn = true;

    const ok = await this.authService.login(email, password);
    if (!ok) {
      this.isLoggingIn = false;
      await this.playLoginErrorShake();
      const t = await this.toastCtrl.create({
        message: 'Login error, please try again',
        duration: 1800,
        position: 'bottom',
        color: 'danger',
      });
      return t.present();
    }

    await this.playLoginSuccessAnimation();

    const redirect = this.authService.consumeRedirectUrl();
    if (redirect) {
      await this.router.navigateByUrl(redirect, { replaceUrl: true });
    } else {
      await this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  }
}
