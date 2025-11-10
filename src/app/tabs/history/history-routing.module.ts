// src/app/tabs/history/history-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryPage } from './history.page';

const routes: Routes = [
  // /tabs/history
  { path: '', component: HistoryPage },

  // /tabs/history/workout-detail/:id  (lazy)
  {
    path: 'workout-detail/:id',
    loadChildren: () =>
      import('./workout-detail/workout-detail.module')
        .then(m => m.WorkoutDetailPageModule),
  },

  // Fallback interno a la lista
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryPageRoutingModule {}
