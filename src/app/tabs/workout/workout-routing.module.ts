import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutPage } from './workout.page';
import { StartPage } from './start/start.page';

const routes: Routes = [
  { path: '', component: WorkoutPage },
  { path: 'start', loadChildren: () => import('./start/start.module').then(m => m.StartPageModule) },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPageRoutingModule {}
