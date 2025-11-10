import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ],
})
export class WorkoutPage {
  constructor(private router: Router, private nav: NavController) {}

  startEmpty(): void {
    this.router.navigate(['/tabs', 'workout', 'start']);
    // o: this.nav.navigateForward('/tabs/workout/start');
  }

  performTemplate(tpl: 'push' | 'pull' | 'legs' | 'custom' = 'push'): void {
    this.router.navigate(['/tabs', 'workout', 'start'], { state: { template: tpl } });
  }
}
