import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateLocationPageRoutingModule } from './create-location-routing.module';

import { CreateLocationPage } from './create-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateLocationPageRoutingModule
  ],
  declarations: [CreateLocationPage]
})
export class CreateLocationPageModule {}
