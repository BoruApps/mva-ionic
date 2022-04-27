import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateassetPageRoutingModule } from './createasset-routing.module';

import { CreateassetPage } from './createasset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateassetPageRoutingModule
  ],
  declarations: [CreateassetPage]
})
export class CreateassetPageModule {}
