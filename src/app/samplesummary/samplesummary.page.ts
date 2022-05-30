import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';

@Component({
    selector: 'app-samplesummary',
    templateUrl: './samplesummary.page.html',
    styleUrls: ['./samplesummary.page.scss'],
})
export class SamplesummaryPage implements OnInit {

    apiurl: any;
    vturl: any;
    loading: any;
    userdata: any;
    barcodenumber: any;
    assetNoRecord: boolean = false;
    assetlist: any = [];
    assetfilterlist = [];
    items = ["chimneyname","cf_922", "assetname","cf_1164"];

    constructor(
        private router: Router,
        public storage: Storage,
        public toastController: ToastController,
        private httpClient: HttpClient,
        public appConst: AppConstants,
        private navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        public loadingController: LoadingController
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
            if (userData.type != undefined && userData.type != '') {
                this.loadSample(userData.type);
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

    logoutUser() {
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
            if (this.loading != undefined) {
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
        this.barcodenumber = '';
        this.ngOnInit();
        event.target.complete();

    }
    async loadSample(type){
        this.showLoading();
        var data = {
            accountid:this.userdata.accountid,
            customerid: this.userdata.id,
            filter : type,
            act : 'assetlist'
        };
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + "GetAssetList.php", data, {headers: headers, observe: 'response'})
            .subscribe(data => {
                this.hideLoading();
                this.assetlist = [];
                this.assetfilterlist = [];
                var verified = data['body']['success'];
                if (verified == true) {
                    var assetRecords = data['body']['data'];
                    for( let i in assetRecords){
                        this.assetlist.push(assetRecords[i]);
                    }
                    this.assetfilterlist = this.assetlist;
                }
            }, error => {
                this.hideLoading();
                this.presentToast('Something went wrong. Please try again');
            });
    }
    async setFilteredLocations(){
        this.assetfilterlist = this.assetlist.filter((asset) => {
            if(this.barcodenumber != undefined && this.barcodenumber != ''){
                for( let i in this.items){
                    var item = this.items[i];
                    if(asset[item].toLowerCase().indexOf(this.barcodenumber.toLowerCase()) > -1){
                        return asset[item].toLowerCase().indexOf(this.barcodenumber.toLowerCase()) > -1;
                    }
                }
            }else{
                return this.assetlist;
            }
        });
    }
}