import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './core/auth.service';
import { DataService } from './core/data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    // Esperamos a que el dispositivo / plataforma esté lista
    await this.platform.ready();

    // Cargamos en paralelo:
    // - el estado de autenticación
    // - los datos persistidos (workouts, medidas, etc.)
    await Promise.all([
      this.authService.loadSessionFromStorage(),
      this.dataService.loadFromStorage(),
    ]);
  }
}
