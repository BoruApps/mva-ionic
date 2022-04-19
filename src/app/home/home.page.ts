import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { TestBed, async } from '@angular/core/testing';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    barcodenumber:any;
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
      public loadingController: LoadingController
      ) {
        this.apiurl = this.appConst.getApiUrl();
        this.vturl = this.appConst.getVtUrl();
    }
    async ngOnInit() {
        await this.storage.create();
        var response = await this.storage.get('userdata').then((data) => {
            if (data && data.length !== 0) {
                return data;
            } else {
                return false;
            }
        })
        if(response){
            this.userdata = response;
        }else{
            this.presentToast('Login failed. Please try again');
        }
    }
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
    async getbarcodenumber() {
        var barcode = this.barcodenumber;
        if(barcode.length > 8){
            var value = barcode.toLowerCase().trim();
            this.scansample();
        }else if(barcode.length == 8) {
            this.scansample();
        }
    }
    async confirmCancelImage(header,message){
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: header,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {}
                },
            ]
        });

        await alert.present();
    }
    async scansample(){
        var data = {
            samplenumber: this.barcodenumber,
        };
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.showLoading();
        this.httpClient.post(this.apiurl + "scanasample.php", data, {headers: headers,observe: 'response'
        }).subscribe(async data => {
            var verified = data['body']['success'];
            if (verified == true) {
                this.storage.set('barcode', this.barcodenumber);
                this.getrelatedAsset(this.barcodenumber);
            } else {
                this.hideLoading();
                var message = 'This barcode number does not exist. Please verify the barcode and enter the correct number above.';
                this.confirmCancelImage('Sample Status',message)
            }
        }, async error => {
            this.hideLoading();
            var message = 'This barcode number does not exist. Please verify the barcode and enter the correct number above.';
            this.confirmCancelImage('Sample Status',message)
        });
    }
    async getrelatedAsset(barcode,assetsonly = false,assetid = 0){
        var data = {
            barcode: barcode,
            accountid: this.userdata.accountid,
            act: 'search_barcode',
        };
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + "OrderTests.php", data, {headers: headers,observe: 'response'
        }).subscribe(data => {
            var verified = data['body']['success'];
            var data = data['body']['data'];
            if (verified == true) {
                this.router.navigateByUrl('/asset');
                this.hideLoading();
                if(data.status){
                    this.confirmCancelImage('Sample Status',data.status);
                }
            } else {
                this.hideLoading();
                this.presentToast('Not Found.');
            }
        }, error => {
            this.hideLoading();
            this.presentToast('Not Found.');
        });
    }
}
