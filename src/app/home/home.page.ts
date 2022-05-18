import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { TestBed, async } from '@angular/core/testing';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

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
      public loadingController: LoadingController
      ) {
        this.apiurl = this.appConst.getApiUrl();
        this.vturl = this.appConst.getVtUrl();
    }
    async ngOnInit() {
        await this.storage.create();

        this.isLogged().then(response => {
            if(response !== false){
                this.userdata = response;
            }else{
                this.presentToast('Login failed. Please try again');
                this.logoutUser();
            }
        });
        this.barcodenumber = '';
        console.log('barcodenumber----');
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

    logoutUser(){
        this.storage.set("userdata", null);
        this.router.navigateByUrl('/');
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
        if(barcode.length >= 8){
            var value = barcode.toLowerCase().trim();
            this.scansample();
        }
    }
    scanBarcode() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log('Barcode data', barcodeData);
            console.log('barcodeData.text', barcodeData.text);
            if(barcodeData.text){
                this.barcodenumber = barcodeData.text
                this.scansample();
            }
            
        }).catch(err => {
            console.log('Error', err);
        });
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
        console.log('data ====== ',data);
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + "OrderTests.php", data, {headers: headers,observe: 'response'
        }).subscribe(data => {
            var responseData = data['body']['data'];
            this.hideLoading();
            if(responseData.status){
                this.confirmCancelImage('Sample Status',responseData.status);
                return false
            }
            var res = [];
            for (var x in responseData.assets.entries){
                    responseData.assets.entries.hasOwnProperty(x) && res.push(responseData.assets.entries[x]);
                }
                this.storage.set('assetsentries',res);
                console.log('assetsentrieselected',responseData.assetid);
                this.storage.set('assetsentrieselected',responseData.assetid);
                this.storage.set('assetnameentrieselected',responseData.assetname);
                this.storage.set('equipmenttype',responseData.cf_922);

                var res0 = [];
                for (var x in responseData.list_locations){
                    responseData.list_locations.hasOwnProperty(x) && res0.push(responseData.list_locations[x]);
                }
                this.storage.set('list_locations',res0);
                var res1 = [];
                for (var x in responseData.tests.values){
                    responseData.tests.values.hasOwnProperty(x) && res1.push(responseData.tests.values[x]);
                }
                this.storage.set('assetstestcheckbox',res1);
                
                var res2 = [];
                for (var x in responseData.tests1.values){
                    responseData.tests1.values.hasOwnProperty(x) && res2.push(responseData.tests1.values[x]);
                }
                console.log('res2 ==== ',res2);
                this.storage.set('assetstestcheckbox1',res2);
                this.storage.set('sample_date',responseData.cf_1110);
                this.storage.set('sample_due_date',responseData.cf_1161);
                this.storage.set('sample_oil_temperature',responseData.cf_1107);
                this.storage.set('identification_comments',responseData.cf_idcomments);
                if(responseData.message){
                    this.storage.set('assetsmessage',responseData.message);
                }else{
                    this.storage.set('assetsmessage','TEST');
                }

            this.router.navigateByUrl('/asset');
        }, error => {
            this.hideLoading();
            this.presentToast('Not Found.');
        });
    }
}
