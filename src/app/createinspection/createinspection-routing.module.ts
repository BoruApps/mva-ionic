import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateinspectionPage } from './createinspection.page';

const routes: Routes = [
  {
    path: '',
    component: CreateinspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateinspectionPageRoutingModule {}
