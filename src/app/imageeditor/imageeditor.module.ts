import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageeditorPageRoutingModule } from './imageeditor-routing.module';

import { ImageeditorPage } from './imageeditor.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageeditorPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [ImageeditorPage]
})
export class ImageeditorPageModule {}
