import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SamplesummaryPageRoutingModule } from './samplesummary-routing.module';

import { SamplesummaryPage } from './samplesummary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SamplesummaryPageRoutingModule
  ],
  declarations: [SamplesummaryPage]
})
export class SamplesummaryPageModule {}
