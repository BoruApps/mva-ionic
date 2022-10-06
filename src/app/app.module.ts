import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// Import modules
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import {AppConstants} from './providers/constant/constant';
import {HttpClientModule} from '@angular/common/http';
import {TermconditionsModal} from './termconditions/termconditions.page';
import {CreateassetPage} from "./createasset/createasset.page";
import {CreateinspectionPage} from "./createinspection/createinspection.page";
import {ConfirmationModal} from "./confirmationmodel/confirmationmodel.page";
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';



@NgModule({
  declarations: [AppComponent,TermconditionsModal,CreateassetPage,CreateinspectionPage,ConfirmationModal],
  entryComponents: [TermconditionsModal,CreateassetPage,CreateinspectionPage,ConfirmationModal],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule , IonicStorageModule.forRoot()],
  providers: [
    Platform,
    StatusBar,
    SplashScreen,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    AppConstants,
    Crop,
    Camera,
    File,
    FileOpener,
    HTTP,
    BarcodeScanner,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}