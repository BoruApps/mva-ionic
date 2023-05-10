import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController, ModalController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import {TermconditionsModal} from '../termconditions/termconditions.page';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  apiurl: any;
  vturl: any;
  userdata: Object;
  username: string;
  password: string;
  isTermChecked: boolean = true;
  termConditionCheckbox: boolean = false;
  isLoginForm: boolean = true;
  isTermError: boolean = false;

  constructor(
      private router: Router,
      public storage: Storage,
      public toastController: ToastController,
      private httpClient: HttpClient,
      public appConst: AppConstants,
      private navCtrl: NavController,
      public loadingController: LoadingController,
      public modalCtrl: ModalController,
      private routerOutlet: IonRouterOutlet
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

  async ngOnInit() {
    await this.storage.create();
    this.routerOutlet.swipeGesture = false;
    
    this.isLogged().then(result => {
      if (!(result == false)) {
        console.log('loading storage data', result);
        this.login(result, "auto");
      } else {
        console.log('init login failed');
      }
    })
  }
  ionViewDidEnter(){
    this.routerOutlet.swipeGesture = false;
  }

  ionViewDidLeave(){
    this.routerOutlet.swipeGesture = false;
  }
  async isLogged() {
    var log_status = this.storage.get('userdata').then((userdata) => {
      console.log('userdata === ',userdata);
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
    
    if (!this.isTermChecked && !this.termConditionCheckbox){
      console.log('You must agree to MVA Terms and Conditions of Use and License to continue.');
      this.presentToast('You must agree to MVA Terms and Conditions of Use and License to continue.');
      return false;
    } 
    
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    if (origin == 'manual') {
      this.showLoading();

      this.httpClient.post(this.apiurl + "authenticate.php", form.value, {headers: headers, observe: 'response'})
          .subscribe( async data => {
            this.hideLoading();
            var verified = data['body']['success'];
            console.log('login response was', verified);

            if (verified == true) {
              var userdata = data['body']['data'];
              console.log('usersdata', userdata);

              this.userdata = userdata;
              this.userdata['theme'] = 'Light';
              await this.storage.set('userdata', this.userdata);
              var log_status = this.storage.get('userdata').then((userdata) => {
                  console.log('userdata ====== ',userdata);
              });
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

  forgotPassword(form: any) {
    console.log('-- In - forgotPassword');

    if (form.value.username === undefined || form.value.username == '') {
      this.presentToast('Please fill email to continue.');
      return false;
    }

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    this.showLoading();

    this.httpClient.post(this.apiurl + "forgetPassword.php", form.value, {headers: headers, observe: 'response'})
        .subscribe(async data => {
          this.hideLoading();

          console.log('forgotPassword response was', data);

          var success = data["body"]["success"];
          if (success == true) {
            this.presentToast('Your request has been submitted and will be processed. For more immediate attention, please call (330) 498-6255.');
          } else {
            this.presentToast('Error while sending forget password email. Please try again after some time.');
          }
        }, error => {
          this.hideLoading();
          console.log('forgotPassword failed');
          this.presentToast('Error while sending forget password email. Please try again after some time.');
        });
  }

  checkTermAndConditions() {
    var data = {
      _operation: 'terms',
      username: this.username,
    };

    if (this.username != '') {
      var headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');

      this.httpClient.post(this.apiurl + "termsconditions.php", data, {headers: headers, observe: 'response'})
          .subscribe(data => {
            this.hideLoading();

            var verified = data['body']['success'];

            if (verified == true) {
              var userdata = data['body']['data'];

              if (userdata.termsconditions == 0) {
                this.isTermChecked = false;
              } else if (userdata.termsconditions == 1) {
                this.isTermChecked = true;
              } else {
                console.log('Wrong Username');
                this.username = '';
                this.password = '';
                this.presentToast('Wrong Username. Please try Again');
              }
            } else {
              console.log('Wrong Username');
              this.username = '';
              this.password = '';
              this.presentToast('Wrong Username. Please try Again');
            }
          });
    }
  }

  async openTermAndConditions(){    
    const addItem = await this.modalCtrl.create({
      component: TermconditionsModal,
      componentProps: {},
      cssClass: 'modal-70',
    });

    addItem.onDidDismiss().then((dataReturned) => {
      console.log('dataReturned',dataReturned.data)
      if (dataReturned.data !== null && dataReturned.data != undefined) {
        if (dataReturned.data.term != undefined && dataReturned.data.term === true){
          console.log('term and condition agreed')
          this.termConditionCheckbox = true;
        }
      }
    });

    return await addItem.present();
  }

  async toggleForm(){
    this.isLoginForm = !this.isLoginForm;
  }
}
