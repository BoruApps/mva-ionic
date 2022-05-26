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
      public homeService: HomeService
      ) {
        this.apiurl = this.appConst.getApiUrl();
        this.vturl = this.appConst.getVtUrl();
    }
    async ngOnInit() {
        await this.storage.create();
        this.barcodenumber = '';
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

                this.storage.set('barcode', this.barcodenumber);
                this.homeService.getrelatedAsset(this.barcodenumber);
            } else {
                var message = 'This barcode number does not exist. Please verify the barcode and enter the correct number above.';
                this.homeService.confirmCancelImage('Sample Status',message)
            }
        }, async error => {
            var message = 'This barcode number does not exist. Please verify the barcode and enter the correct number above.';
            this.homeService.confirmCancelImage('Sample Status',message)
        });
    }
    
}
