import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkoutPageRoutingModule } from './workout-routing.module';
import { WorkoutPage } from './workout.page';

@NgModule({
  imports: [
    RouterModule,
    WorkoutPageRoutingModule,
    WorkoutPage, // <- importar el componente standalone (NO va en declarations)
  ],
  // declarations: [] // nada aquí
})
export class WorkoutPageModule {}
