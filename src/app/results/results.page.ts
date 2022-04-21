import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
    apiurl: any;
    vturl: any;
    loading: any;
    userdata: any;
    assetlist: any = [];
    filterData = [];
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
        this.getSerialAsset();
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
    async getSerialAsset(){
        var data = {
            accountid: this.userdata.accountid
        };
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.showLoading();
        this.httpClient.post(this.apiurl + "scanAssetSerial.php", data, {headers: headers,observe: 'response'
        }).subscribe(data => {
            var verified = data['body']['success'];
            if (verified == true) {
                this.hideLoading();
                var assetdatalites = data['body']['data']['assets']['entries'];
                for( let i in assetdatalites) {   //Pay attention to the 'in'
                    this.assetlist.push(assetdatalites[i]);
                }
                this.filterData = this.assetlist;
            } else {
                this.hideLoading();
                this.presentToast('Not Found.');
            }
        }, error => {
            this.hideLoading();
            this.presentToast('Not Found.');
        });
    }
    async setFilteredLocations(event){
        var searchTerm = event.target.value;
        this.filterData = this.assetlist.filter((asset) => {
            if(searchTerm != undefined){
                return asset.assetname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            }
        });
    }
}
