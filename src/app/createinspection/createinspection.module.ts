import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateinspectionPageRoutingModule } from './createinspection-routing.module';

import { CreateinspectionPage } from './createinspection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateinspectionPageRoutingModule
  ],
  declarations: [CreateinspectionPage]
})
export class CreateinspectionPageModule {}
