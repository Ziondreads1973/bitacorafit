// src/app/tabs/history/history.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, WorkoutSession } from 'src/app/core/data';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false,
})
export class HistoryPage implements OnInit {
  items: WorkoutSession[] = [];

  constructor(
    private data: DataService,
    private router: Router
  ) {}

  private refresh(): void {
    // Orden por fecha descendente
    this.items = [...this.data.workouts].sort(
      (a, b) => b.dateISO.localeCompare(a.dateISO)
    );
  }

  ngOnInit(): void {
    this.refresh();
  }

  ionViewWillEnter(): void {
    // Se llama cada vez que vuelves a la pestaña
    this.refresh();
  }

  // Para *ngFor
  trackById = (_: number, w: WorkoutSession) => w.id;

  openDetail(w: WorkoutSession): void {
    // Navega a la ruta hija definida en HistoryRouting:
    // /tabs/history/workout-detail/:id
    this.router.navigate(['/tabs', 'history', 'workout-detail', w.id]);
  }
}
