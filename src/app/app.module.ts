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
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@NgModule({
  declarations: [AppComponent,TermconditionsModal],
  entryComponents: [TermconditionsModal],
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
    File,
    FileOpener,
    HTTP
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}