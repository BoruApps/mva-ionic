import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermconditionsModal } from './termconditions.page';

const routes: Routes = [
  {
    path: '',
    component: TermconditionsModal
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermconditionsModalRoutingModule {}
