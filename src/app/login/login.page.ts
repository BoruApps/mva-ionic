import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  apiurl: any;
  vturl: any;
  userdata: Object;

  constructor(
      private router: Router,
      public storage: Storage,
      public toastController: ToastController,
      private httpClient: HttpClient,
      public appConst: AppConstants,
      private navCtrl: NavController,
      public loadingController: LoadingController
  ) {
    this.apiurl = this.appConst.getApiUrl();
    this.vturl = this.appConst.getVtUrl();
  }

  loading: any;

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading ...'
    });
    return await this.loading.present();
  }

  async hideLoading() {
    setTimeout(() => {
      if(this.loading != undefined){
        this.loading.dismiss();
      }
    }, 1000);
  }
  
  async presentToast(message: string) {
    var toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: "top",
      color: "danger"
    });
    toast.present();
  }

  movefocus(e, ref) {
    if (e.key == "Enter") {
      ref.setFocus();
    }
  }

  submit(e, ref) {
    if (e.key == "Enter") {
      console.log('submitting');
      let el: HTMLElement = document.getElementById('submit-button') as HTMLElement;
      el.click()
    }
  }

  async ngOnInit() {
    await this.storage.create();
    
    this.isLogged().then(result => {
      if (!(result == false)) {
        console.log('loading storage data', result);
        this.login(result, "auto");
      } else {
        console.log('init login failed');
      }
    })
  }

  async isLogged() {
    var log_status = this.storage.get('userdata').then((userdata) => {
      if (userdata && userdata.length !== 0) {
        return userdata;
      } else {
        return false;
      }
    });
    return log_status;
  }

  login(form: any, origin: any) {
    console.log('login function accessed');
    
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    if (origin == 'manual') {
      this.showLoading();

      this.httpClient.post(this.apiurl + "authenticate.php", form.value, {headers: headers, observe: 'response'})
          .subscribe(data => {
            this.hideLoading();
            var verified = data['body']['success'];
            console.log('login response was', verified);

            if (verified == true) {
              var userdata = data['body']['data'];
              console.log('usersdata', userdata);

              this.userdata = userdata;
              this.userdata['theme'] = 'Light';
              this.storage.set('userdata', this.userdata);
              this.navCtrl.navigateForward('/home');
              
            } else {
              console.log('login failed');
              this.presentToast('Login failed. Please try again');
            }
          }, error => {
            this.hideLoading();
            console.log('login failed');
            this.presentToast('Login failed. Please try again');
          });
    } else if (origin == 'auto') {
      console.log('auto login from session');
      this.navCtrl.navigateForward('/home');
    }
    return false;
  }
}
