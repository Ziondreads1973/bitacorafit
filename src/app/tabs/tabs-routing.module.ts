import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(m => m.ProfilePageModule),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('./history/history.module').then(m => m.HistoryPageModule),
      },
      {
        path: 'workout',
        loadChildren: () =>
          import('./workout/workout.module').then(m => m.WorkoutPageModule),
      },
      {
        path: 'exercises',
        loadChildren: () =>
          import('./exercises/exercises.module').then(m => m.ExercisesPageModule),
      },
      {
        path: 'measure',
        loadChildren: () =>
          import('./measure/measure.module').then(m => m.MeasurePageModule),
      },

      // Default child: /tabs → /tabs/profile
      { path: '', redirectTo: 'profile', pathMatch: 'full' },

      // Fallback child: evita quedarse “pegado” en rutas desconocidas bajo /tabs
      { path: '**', redirectTo: 'profile' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
