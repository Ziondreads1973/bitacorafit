import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeightDetailPageRoutingModule } from './weight-detail-routing.module';

import { WeightDetailPage } from './weight-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeightDetailPageRoutingModule
  ],
  declarations: [WeightDetailPage]
})
export class WeightDetailPageModule {}
