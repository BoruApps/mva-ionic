import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageeditorPage } from './imageeditor.page';

const routes: Routes = [
  {
    path: '',
    component: ImageeditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageeditorPageRoutingModule {}
