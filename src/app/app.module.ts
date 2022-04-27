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
@NgModule({
  declarations: [AppComponent,TermconditionsModal,CreateassetPage],
  entryComponents: [TermconditionsModal,CreateassetPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule , IonicStorageModule.forRoot()],
  providers: [
    Platform,
    StatusBar,
    SplashScreen,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    AppConstants
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}