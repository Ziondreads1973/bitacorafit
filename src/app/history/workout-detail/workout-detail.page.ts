import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { DataService, WorkoutSession } from 'src/app/core/data';

type SetWith1RM = { kg: number; reps: number; est1RM: number };
type ExWith1RM = { name: string; sets: SetWith1RM[]; best1RM: number };

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
  standalone: false,
})
export class WorkoutDetailPage implements OnInit {
  w?: WorkoutSession;
  exRows: ExWith1RM[] = [];
  totalVolume = 0;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private nav: NavController,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private async notFound(): Promise<void> {
    const t = await this.toast.create({
      message: 'Workout not found',
      duration: 1500,
      color: 'warning',
    });
    await t.present();
    this.nav.back();
  }

  private load(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    const w = this.data.getWorkoutById(id);
    if (!w) {
      this.notFound();
      return;
    }
    this.w = w;

    // Tabla por ejercicio con 1RM estimado (Epley: 1RM = kg * (1 + reps/30))
    this.exRows = w.exercises.map((e) => {
      const sets: SetWith1RM[] = e.sets.map((s) => ({
        kg: s.kg,
        reps: s.reps,
        est1RM: Number((s.kg * (1 + s.reps / 30)).toFixed(1)),
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
