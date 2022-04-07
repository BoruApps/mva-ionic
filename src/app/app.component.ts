import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import {AppConstants} from "./providers/constant/constant";
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  activePageTitle = 'Dashboard';
  Pages = [
    {
      title: 'Dashboard',
      url: 'home',
      icon: 'albums'
    },{
      title: 'Sample Summary',
      url: 'home',
      icon: 'albums',
      submenu:[
        {
          title: 'tab1',
          url: 'home',
          icon: 'albums'
        },
        {
          title: 'tab2',
          url: 'home',
          icon: 'albums'
        }
      ]
    },{
      title: 'Results',
      url: 'home',
      icon: 'document'
    },{
      title: 'Profile',
      url: 'profile',
      icon: 'person'
    },{
      title: 'Logout',
      url: 'logout',
      icon: 'log-out'
    },
  ];

  constructor(
      private router: Router,
      public storage: Storage,
      public toastController: ToastController,
      private httpClient: HttpClient,
      public appConst: AppConstants,
      private navCtrl: NavController,
      public loadingController: LoadingController,
      private platform: Platform,
      private statusBar: StatusBar,
      private splashScreen: SplashScreen,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    await this.storage.create();
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  logoutUser(){
      console.log('logout clicked');
      this.storage.set("userdata", null);
      this.router.navigateByUrl('/');
  }
}