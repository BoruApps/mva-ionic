import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { HomeService } from '../home/home.service';
import { Platform } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    barcodenumber:any = '';
    apiurl: any;
    vturl: any;
    loading: any;
    userdata: any;
    constructor(
      private router: Router,
      public storage: Storage,
      public toastController: ToastController,
      private httpClient: HttpClient,
      public appConst: AppConstants,
      private navCtrl: NavController,
      public alertController: AlertController,
      private barcodeScanner: BarcodeScanner,
      public loadingController: LoadingController,
      public homeService: HomeService,
      private platform: Platform,
      private routerOutlet: IonRouterOutlet
      ) {
        this.apiurl = this.appConst.getApiUrl();
        this.vturl = this.appConst.getVtUrl();
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateForward('/home');
        });
    }
    async ngOnInit() {
        this.routerOutlet.swipeGesture = false;
        await this.storage.create();
        await this.isLogged().then(response => {
            if (response !== false) {
                this.userdata = response;
            } else {
                this.presentToast('Login failed. Please try again');
                this.logoutUser();
            }
        });
        this.barcodenumber = '';
        this.storage.remove('assetstestcheckbox1');
        this.storage.remove('assetstestcheckbox');
    }
    ionViewDidEnter(){
        this.routerOutlet.swipeGesture = false;
    }

    ionViewDidLeave(){
        this.routerOutlet.swipeGesture = false;
    }
    async getbarcodenumber() {
        var barcode = this.barcodenumber;
        if(barcode.length >= 8){
            var value = barcode.toLowerCase().trim();
            this.scansample();
        }
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
    async logoutUser() {
        await this.storage.set("userdata", null);
        this.router.navigateByUrl('/');
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
    scanBarcode() {
        var option = {
                disableAnimations: false,
                disableSuccessBeep: true,
            }
        this.barcodeScanner.scan(option).then(barcodeData => {
            if(barcodeData.text){
                this.barcodenumber = barcodeData.text
            }
            
        }).catch(err => {
            console.log('Error', err);
        });
    }
    async doRefresh(event) {
        this.barcodenumber = '';
        event.target.complete();

    }
    async scansample(){
        var data = {
            samplenumber: this.barcodenumber,
        };
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + "scanasample.php", data, {headers: headers,observe: 'response'
        }).subscribe(async data => {
            var verified = data['body']['success'];
            if (verified == true) {

                await this.storage.set('barcode', this.barcodenumber);
                await this.homeService.getrelatedAsset(this.barcodenumber);
            } else {
                var message = 'This barcode number does not exist. Please verify the barcode and enter the correct number above.';
                this.homeService.confirmCancelImage('Sample Status',message)
            }
            this.barcodenumber = '';
        }, async error => {
            var message = 'This barcode number does not exist. Please verify the barcode and enter the correct number above.';
            this.homeService.confirmCancelImage('Sample Status',message)
        });
    }
    
}
