import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  // Auth (pública)
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },

  // Tabs container (todos los tabs viven dentro) - PROTEGIDO
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },

  // Páginas fuera de tabs (detalles / ajustes) - también protegidas
  {
    path: 'workout-detail',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./tabs/history/workout-detail/workout-detail.module').then(
        (m) => m.WorkoutDetailPageModule
      ),
  },

  // 👇 Ruta REAL que usas desde Measure: /measure/weight-detail
  {
    path: 'measure/weight-detail',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./measure/weight-detail/weight-detail.module').then(
        (m) => m.WeightDetailPageModule
      ),
  },

  // 👇 Alias por si en algún lado llegas a usar /weight-detail a secas
  {
    path: 'weight-detail',
    redirectTo: 'measure/weight-detail',
    pathMatch: 'full',
  },

  {
    path: 'edit-profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./profile/edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
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
