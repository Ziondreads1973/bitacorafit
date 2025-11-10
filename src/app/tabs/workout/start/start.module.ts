import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { StartPage } from './start.page';

const routes: Routes = [
  { path: '', component: StartPage }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,            // para [(ngModel)]
    IonicModule,            // para componentes <ion-...>
    RouterModule.forChild([{ path: '', component: StartPage }])
  ],
  declarations: [StartPage]
})
export class StartPageModule {}
