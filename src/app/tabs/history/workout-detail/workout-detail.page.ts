import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { DataService, WorkoutSession } from 'src/app/core/data';
import { Subscription } from 'rxjs';

type SetWith1RM = { kg: number; reps: number; est1RM: number };
type ExWith1RM = { name: string; sets: SetWith1RM[]; best1RM: number };

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
  standalone: false,
})
export class WorkoutDetailPage implements OnInit, OnDestroy {
  w?: WorkoutSession;
  exRows: ExWith1RM[] = [];
  totalVolume = 0;

  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private nav: NavController,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    // Carga inicial inmediata
    const firstId = this.getIdFromRoute();
    if (firstId) {
      this.load(firstId);
    } else {
      this.notFound();
    }

    // Reacciona a cambios posteriores de parámetros (ej. navegación dentro del detalle)
    this.sub = this.route.paramMap.subscribe(() => {
      const id = this.getIdFromRoute();
      if (!id) {
        this.notFound();
        return;
      }
      if (!this.w || this.w.id !== id) this.load(id);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ===== Helpers de ruta / datos =====
  private getIdFromRoute(): string | null {
    // Prioriza /workout-detail/:id pero soporta también ?id= por si llegas con query
    return (
      this.route.snapshot.paramMap.get('id') ??
      this.route.snapshot.queryParamMap.get('id')
    );
  }

  private epley1RM(kg: number, reps: number): number {
    // 1RM ≈ kg * (1 + reps/30) → redondeo a 0.1
    const val = kg * (1 + reps / 30);
    return Math.round(val * 10) / 10;
  }

  trackByExercise = (_: number, r: ExWith1RM) => r.name;
  trackBySet = (_: number, s: SetWith1RM) => `${s.kg}x${s.reps}`;

  // ===== Navegación / mensajes =====
  private async notFound(): Promise<void> {
    const t = await this.toast.create({
      message: 'Workout not found',
      duration: 1500,
      color: 'warning',
    });
    await t.present();
    this.nav.navigateRoot('/tabs/history');
  }

  // ===== Carga de datos =====
  private load(id: string): void {
    const w = this.data.getWorkoutById(id);
    if (!w) {
      this.notFound();
      return;
    }
    this.w = w;

    // Tabla por ejercicio con 1RM estimado (Epley)
    this.exRows = w.exercises.map((e) => {
      const sets: SetWith1RM[] = e.sets.map((s) => ({
        kg: s.kg,
        reps: s.reps,
        est1RM: this.epley1RM(s.kg, s.reps),
      }));
      const best1RM = sets.reduce((m, s) => Math.max(m, s.est1RM), 0);
      return { name: e.name, sets, best1RM };
    });

    // Volumen total (Σ kg × reps)
    this.totalVolume = w.exercises.reduce((sum, e) => {
      const sub = e.sets.reduce((acc, s) => acc + s.kg * s.reps, 0);
      return sum + sub;
    }, 0);
  }
}
