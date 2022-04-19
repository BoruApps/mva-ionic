import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermconditionsModalRoutingModule } from './termconditions-routing.module';

import { TermconditionsModal } from './termconditions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermconditionsModalRoutingModule
  ],
  declarations: [TermconditionsModal]
})
export class TermconditionsModalModule {}
