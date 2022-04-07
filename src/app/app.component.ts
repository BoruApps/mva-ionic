import { Component } from '@angular/core';
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
      url: 'home',
      icon: 'person'
    },{
      title: 'Logout',
      url: 'home',
      icon: 'log-out'
    },
  ];
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}