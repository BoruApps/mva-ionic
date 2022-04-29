import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateLocationPage } from './create-location.page';

const routes: Routes = [
  {
    path: '',
    component: CreateLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateLocationPageRoutingModule {}
