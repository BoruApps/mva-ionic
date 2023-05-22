import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastController, NavController,Platform} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
    apiurl: any;
    vturl: any;
    loading: any;
    serialnumber: any;
    userdata: any;
    assetlist: any = [];
    assetfilterlist = [];
    timer = 0;
    constructor(
        private router: Router,
        public storage: Storage,
        public toastController: ToastController,
        private httpClient: HttpClient,
        public appConst: AppConstants,
        private navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        public loadingController: LoadingController,
        private platform: Platform,
        private http: HTTP,
        private iab: InAppBrowser
    ) {
        this.apiurl = this.appConst.getApiUrl();
        this.vturl = this.appConst.getVtUrl();
    }
    async ngOnInit() {
        await this.storage.create();
        await this.isLogged().then(response => {
            if (response !== false) {
                this.userdata = response;
            } else {
                this.presentToast('Login failed. Please try again');
                this.logoutUser();
            }
        });
        this.activatedRoute.params.subscribe((userData) => {
            this.getSerialAsset();
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
    async logoutUser() {
        await this.storage.set("userdata", null);
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
    async doRefresh(event) {
        this.serialnumber = '';
        this.assetlist = [];
        this.ngOnInit();
        event.target.complete();

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
                var assetdatalist = data['body']['data']['assets']['entries'];
                for( let i in assetdatalist){
                    this.assetlist.push(assetdatalist[i]);
                }
                this.assetlist = this.assetlist.reverse();
                this.assetfilterlist = this.assetlist;
            } else {
                this.hideLoading();
                this.presentToast('Something went wrong. Please try again');
            }
        }, error => {
            this.hideLoading();
            this.presentToast('Something went wrong. Please try again');
        });
    }
    async setFilteredLocations() {
        var self = this;
        clearTimeout(this.timer);
        var ms = 800; // milliseconds
        this.timer = setTimeout(function() {
            self.getFilteredLocations();
        }, ms);
    }
    async getFilteredLocations(){

        if(this.serialnumber != ''){
            var postdata = {
                accountid: this.userdata.accountid,
                search_column : 'assetname',
                search_value : this.serialnumber,
            };
            this.showLoading();
            var headers = new HttpHeaders();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("Access-Control-Allow-Origin", "*");

            this.httpClient.post(this.apiurl + "scanAssetSerial.php", JSON.stringify(postdata), {
                headers: headers,
                observe: "response",
            }).subscribe(async (data) => {
                var verified = data['body']['success'];
                this.hideLoading();
                if (verified == true) {
                    this.assetfilterlist = [];
                    var assetdatalist = data['body']['data']['assets']['entries'];
                    for( let i in assetdatalist){
                        this.assetfilterlist.push(assetdatalist[i]);
                    }
                    this.assetfilterlist = this.assetfilterlist.reverse();
                } else if(data['body']['data'] == 'Not Found') {
                    this.assetfilterlist = [];
                }else{
                    this.presentToast('Something went wrong. Please try again');
                    this.assetfilterlist = this.assetlist;
                }
            });
        }else{
            this.assetfilterlist = this.assetlist;
        }

    }
    async assetPDF(selectassetsid){
        var data = {
            selectassetsid: selectassetsid
        };
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.showLoading();
        this.httpClient.post(this.apiurl + "AssetPdf.php", data, {headers: headers,observe: 'response'
        }).subscribe(data => {
            var verified = data['body']['success'];
            if (verified == true) {
                 this.hideLoading();
                var url = data['body']['pdfFilePath'];

                if (this.platform.is('android')) {
                    url = 'https://docs.google.com/viewer?url=' + url;
                }
                var options = "location=yes,hidden=no,toolbar=yes,clearcache=yes,clearsessioncache=yes";

                this.iab.create(url, "_blank",options);
                return true;
            } else {
                this.hideLoading();
                this.presentToast('Something went wrong. Please try again');
            }
        }, error => {
            this.hideLoading();
            this.presentToast('Something went wrong. Please try again');
        });
    }
}
