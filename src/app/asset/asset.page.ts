import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastController, NavController,Platform} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';
import { AlertController,ModalController } from '@ionic/angular';
import { CreateassetPage } from "../createasset/createasset.page";

@Component({
  selector: 'app-asset',
  templateUrl: './asset.page.html',
  styleUrls: ['./asset.page.scss'],
})
export class AssetPage implements OnInit {
	barcodenumberasset:any;
  apiurl: any;
    vturl: any;
    loading: any;
    userdata: any;
    assetfilter: any = 'serialnumber';
    assetsentrieselected: any;
    assetsentries: any = [];
    assetfilterlist = [];
    assetstestcheckbox = [];
    assetstestcheckbox1 = [];
    list_locations = [];
    searchassetflag = 0;
    iscreateasset = 0;
    constructor(
        private router: Router,
        public storage: Storage,
        public toastController: ToastController,
        private httpClient: HttpClient,
        public appConst: AppConstants,
        private navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        public alertController: AlertController,
        public loadingController: LoadingController,
        public modalCtrl: ModalController,
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
        this.storage.get('assetsentries').then((assetsentries) => {
          this.assetsentries = assetsentries;
          this.assetfilterlist = assetsentries;
          console.log('this.assetfilterlist == ',this.assetfilterlist);
        });
        this.storage.get('assetsentrieselected').then((assetsentrieselected) => {
          this.assetsentrieselected = assetsentrieselected;
        });
        this.storage.get('assetstestcheckbox1').then((assetstestcheckbox1) => {
          this.assetstestcheckbox1 = assetstestcheckbox1;
          console.log('this.assetstestcheckbox1 == ',this.assetstestcheckbox1);
        });
        this.storage.get('list_locations').then((list_locations) => {
          this.list_locations = list_locations;
          console.log('this.list_locations == ',this.list_locations);
        });
        this.storage.get('assetstestcheckbox').then((assetstestcheckbox) => {
          this.assetstestcheckbox = assetstestcheckbox;
          console.log('this.assetstestcheckbox == ',this.assetstestcheckbox);
        });
        this.storage.get('userdata').then((userdata) => {
          console.log('this.userdata - Asset == ',userdata);
        });
        this.storage.get('barcode').then((barcode) => {
          console.log('this.barcode - Asset == ',barcode);
        });
        this.storage.get('assetsmessage').then((assetsmessage) => {
          if(assetsmessage != 'TEST'){
            this.confirmCancelImage('Warning message',assetsmessage);
          }
        });
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
    async checkTest(event){
      var asset_id = this.assetsentrieselected;
      if(asset_id == '') {
        this.presentToast('Please select an existing asset or create new one.');
        //document.getElementById(obj.id).checked = false;
            return;
        }
      var a_temp = event.target.value;
      var a_tempArr = a_temp.split(',');
      console.log('a_temp === ',a_temp);
      console.log('a_tempArr === ',a_tempArr);
      console.log('this.assetstestcheckbox1 - brfore',this.assetstestcheckbox1);
      for (var x in this.assetstestcheckbox1){
        var tmp = this.assetstestcheckbox1[x];
          if(tmp.isbundle == 0){
            this.assetstestcheckbox1[x].checkboxvalue = 0;
          console.log('========== tmp.isbundle == ',tmp.isbundle);
          }
      }
      console.log('this.assetstestcheckbox1 - after',this.assetstestcheckbox1);
    }

    async createasset(){
      console.log('barcodenumberasset == ',this.barcodenumberasset);
      const modal_createasset = await this.modalCtrl.create({
        component: CreateassetPage,
        componentProps: {
          paramTitle: 'Create Your Asset',
          list_locations: this.list_locations,
          selectedbarcode: this.barcodenumberasset,
        },
      });
      modal_createasset.onDidDismiss().then((dataReturned) => {
          if(dataReturned['data']['newasset'][0] !== undefined){
            this.assetfilterlist.push(dataReturned['data']['newasset'][0]);
            this.assetsentries.push(dataReturned['data']['newasset'][0]);
            this.searchassetflag = 0;
          }
      });
      return await modal_createasset.present();
    }
    async getbarcodenumberasset(event){
        var searchTerm = event.target.value;
        this.assetfilterlist = this.assetsentries.filter((asset) => {
            if(searchTerm === undefined){
              return false
            }
            if(this.assetfilter == 'serialnumber'){
              return asset.assetname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            }else if(this.assetfilter == 'unitid'){
              return asset.cf_1164.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            }else if(this.assetfilter == 'equipmentid'){
              return asset.cf_922.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            }else if(this.assetfilter == 'substationname'){
              return asset.multiaddressid.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            }
        });
        if(this.assetfilterlist.length == 0){
          this.searchassetflag = 1;
        }else{
          this.searchassetflag = 0;
        }
    }
}
