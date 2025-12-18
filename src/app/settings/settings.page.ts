import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../core/auth.service';
import { StorageService } from '../core/storage';

type UnitSystem = 'kg' | 'lb';

interface AppSettings {
  darkMode: boolean;
  units: UnitSystem;
  reduceMotion: boolean;
}

const SETTINGS_KEY = 'app_settings_v1';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  email: string | null = null;

  settings: AppSettings = {
    darkMode: false,
    units: 'kg',
    reduceMotion: false,
  };

  readonly appName = 'BitacoraFit';
  readonly appVersionLabel = 'v2';

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private nav: NavController,
    private alert: AlertController,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    this.email = this.auth.getEmail();
    await this.loadSettings();
  }

  back(): void {
    this.nav.back();
  }

  private applySettingsToUI(): void {
    document.body.classList.toggle('dark', this.settings.darkMode);
    document.body.classList.toggle('reduce-motion', this.settings.reduceMotion);
  }

  private async loadSettings(): Promise<void> {
    const stored = await this.storage.get<AppSettings>(SETTINGS_KEY);
    if (stored) {
      this.settings = { ...this.settings, ...stored };
    }
    this.applySettingsToUI();
  }

  private async saveSettings(): Promise<void> {
    await this.storage.set<AppSettings>(SETTINGS_KEY, this.settings);
  }

  async onDarkModeChange(ev: any): Promise<void> {
    this.settings.darkMode = !!ev?.detail?.checked;
    this.applySettingsToUI();
    await this.saveSettings();
  }

  async onUnitsChange(ev: any): Promise<void> {
    const value = (ev?.detail?.value as UnitSystem) ?? 'kg';
    this.settings.units = value;
    await this.saveSettings();

    const t = await this.toast.create({
      message: `Unidades guardadas: ${value.toUpperCase()}`,
      duration: 1200,
      position: 'bottom',
    });
    await t.present();
  }

  async onReduceMotionChange(ev: any): Promise<void> {
    this.settings.reduceMotion = !!ev?.detail?.checked;
    this.applySettingsToUI();
    await this.saveSettings();
  }

  async resetPreferences(): Promise<void> {
    const a = await this.alert.create({
      header: 'Restablecer preferencias',
      message: 'Se restaurarán los valores por defecto (no afecta tus datos).',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Restablecer',
          role: 'destructive',
          handler: async () => {
            this.settings = {
              darkMode: false,
              units: 'kg',
              reduceMotion: false,
            };
            this.applySettingsToUI();
            await this.saveSettings();

            const t = await this.toast.create({
              message: 'Preferencias restablecidas.',
              duration: 1500,
              position: 'bottom',
            });
            await t.present();
          },
        },
      ],
    });
    await a.present();
  }

  async logout(): Promise<void> {
    const a = await this.alert.create({
      header: 'Cerrar sesión',
      message: '¿Deseas cerrar tu sesión ahora?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: async () => {
            await this.auth.logout();
          },
        },
      ],
    });
    await a.present();
  }

  async showAbout(): Promise<void> {
    const a = await this.alert.create({
      header: 'Acerca de',
      message: `${this.appName} ${this.appVersionLabel}\n\nApp Ionic Angular para registrar entrenamientos, visualizar progreso y organizar rutinas.`,
      buttons: ['OK'],
    });
    await a.present();
  }
}
