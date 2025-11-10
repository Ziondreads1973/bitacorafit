import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkoutDetailPage } from './workout-detail.page';

const routes: Routes = [
  { path: ':id', component: WorkoutDetailPage },
  { path: '', redirectTo: '/tabs/history', pathMatch: 'full' }, // fallback opcional
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutDetailPageRoutingModule {}
