import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateassetPage } from './createasset.page';

const routes: Routes = [
  {
    path: '',
    component: CreateassetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateassetPageRoutingModule {}
