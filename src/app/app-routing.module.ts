import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Auth
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },

  // Tabs container (todos los tabs viven dentro)
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },

  // Páginas fuera de tabs (detalles / ajustes)
  {
    path: 'workout-detail',
    loadChildren: () =>
      import('./tabs/history/workout-detail/workout-detail.module').then(
        (m) => m.WorkoutDetailPageModule
      ),
  },
  {
    path: 'weight-detail',
    loadChildren: () =>
      import('./measure/weight-detail/weight-detail.module').then(
        (m) => m.WeightDetailPageModule
      ),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./profile/edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
  },

  // Defaults
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
