import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastController, NavController, Platform} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';
import {AlertController, ModalController} from '@ionic/angular';
import {CreateassetPage} from "../createasset/createasset.page";
import {CreateinspectionPage} from "../createinspection/createinspection.page";
import {Crop} from '@ionic-native/crop/ngx';
import {Camera, CameraOptions} from '@awesome-cordova-plugins/camera/ngx';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {ImageeditorPage} from "../imageeditor/imageeditor.page";
import { HomeService } from '../home/home.service';

@Component({
    selector: 'app-asset',
    templateUrl: './asset.page.html',
    styleUrls: ['./asset.page.scss'],
})
export class AssetPage implements OnInit {
    barcodenumberasset: any = '';
    apiurl: any;
    vturl: any;
    loading: any;
    sample_date: any;
    sample_due_date: any;
    sample_oil_temperature: any;
    assetnameentrieselected: any;
    equipmenttype: any;
    identification_comments: any;
    cf_job_number: any;
    topcounter: any;
    userdata: any;
    barcode: any;
    assetfilter: any = 'serialnumber';
    assetsentrieselected: any;
    selectedbundle: any;
    croppedImagepath = "";
    assetsentries: any = [];
    assetfilterlist = [];
    assetstestcheckboxconstruct = [];
    assetstestcheckboxconstruct1 = [];
    assetstestcheckbox = [];
    assetstestcheckbox1 = [];
    list_locations = [];
    searchassetflag = 0;
    iscreateasset = 0;
    istapcounterreading = 0;
    timer = 0;

    buttonLabels = ['Take Photo', 'Upload from Library'];
    public subSection: number;
    public sectionKey: number;

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
        private crop: Crop,
        private camera: Camera,
        private file: File,
        public homeService: HomeService
    ) {
        this.apiurl = this.appConst.getApiUrl();
        this.vturl = this.appConst.getVtUrl();
        if (router.getCurrentNavigation().extras.state) {
            const assetstestcheckboxArr = this.router.getCurrentNavigation().extras.state;
            this.assetstestcheckboxconstruct = assetstestcheckboxArr['assetstestcheckbox'];
            this.assetstestcheckboxconstruct1 = assetstestcheckboxArr['assetstestcheckbox1'];
            console.log('---- constructor ----');
            console.log('constructor - this.assetstestcheckboxconstruct == ',this.assetstestcheckboxconstruct);
            console.log('constructor - this.assetstestcheckboxconstruct1 == ',this.assetstestcheckboxconstruct1);
        }
    }

    async ngOnInit() {
        await this.storage.create();
        this.userdata = await  this.storage.get('userdata').then((userdata) => {
            if (userdata && userdata.length !== 0) {
                return userdata;
            } else {
                return false;
            }
        });
        this.storage.get('assetsentrieselected').then((assetsentrieselected) => {
            this.assetsentrieselected = assetsentrieselected;
        });
        this.storage.get('assetsentries').then((assetsentries) => {
            assetsentries = assetsentries.reverse();
            this.assetsentries = assetsentries;
            this.assetfilterlist = assetsentries;
            for (var i = 0; i < this.assetfilterlist.length; i++) {
                if (this.assetfilterlist[i].assetid == this.assetsentrieselected) {
                    var imortant_note = this.assetfilterlist.splice(i, 1);
                    this.assetfilterlist.unshift(imortant_note[0]);
                }
            }
        });
        console.log('asset-assetfilterlist', this.assetfilterlist);


        this.storage.get('assetnameentrieselected').then((assetnameentrieselected) => {
            this.assetnameentrieselected = assetnameentrieselected;
        });
        this.storage.get('equipmenttype').then((equipmenttype) => {
            this.equipmenttype = equipmenttype;
        });
        this.storage.get('sample_date').then((sample_date) => {
            this.sample_date = sample_date;
        });
        this.storage.get('sample_due_date').then((sample_due_date) => {
            this.sample_due_date = sample_due_date;
        });
        this.storage.get('sample_oil_temperature').then((sample_oil_temperature) => {
            this.sample_oil_temperature = sample_oil_temperature;
        });
        this.storage.get('identification_comments').then((identification_comments) => {
            this.identification_comments = identification_comments;
        });
        this.storage.get('cf_job_number').then((cf_job_number) => {
            this.cf_job_number = cf_job_number;
            console.log('this.cf_job_number = ',this.cf_job_number);
        });
        console.log('init - this.assetstestcheckboxconstruct == ',this.assetstestcheckboxconstruct);
        console.log('init - this.assetstestcheckboxconstruct1 == ',this.assetstestcheckboxconstruct1);

        this.assetstestcheckbox = this.assetstestcheckboxconstruct;
        this.assetstestcheckbox1 = this.assetstestcheckboxconstruct1;
        for (var x in this.assetstestcheckbox1) {
            var tmp = this.assetstestcheckbox1[x];
            if (tmp.isbundle == 1 && this.assetstestcheckbox1[x].checkboxvalue) {
                this.selectedbundle = this.assetstestcheckbox1[x].fieldname;
            }
        }
        for (var x in this.assetstestcheckbox) {
            var tmp = this.assetstestcheckbox[x];
            if (tmp.isbundle == 1 && this.assetstestcheckbox[x].checkboxvalue) {
                this.selectedbundle = this.assetstestcheckbox[x].fieldname;
            }
        }
        console.log('assetstestcheckbox == ',this.assetstestcheckbox);
        console.log('assetstestcheckbox1 == ',this.assetstestcheckbox1);
        this.storage.get('list_locations').then((list_locations) => {
            this.list_locations = list_locations;
        });

        this.storage.get('userdata').then((userdata) => {
        });
        this.storage.get('barcode').then((barcode) => {
            this.barcode = barcode;
        });
        this.storage.get('assetsmessage').then((assetsmessage) => {
            if (assetsmessage != 'TEST') {
                this.homeService.confirmCancelImage('Warning message', assetsmessage);
            }
        });

    }

    async doRefresh(event) {
        this.storage.remove('assetstestcheckbox1');
        this.storage.remove('assetstestcheckbox');
        this.barcodenumberasset = '';
        await this.homeService.getrelatedAsset(this.barcode,true);
        await this.ngOnInit();
        console.log('doRefresh-assetstestcheckbox == ',this.assetstestcheckbox);
        console.log('doRefresh-assetstestcheckbox1 == ',this.assetstestcheckbox1);
        event.target.complete();

    }
    async SaveTests() {
        var fieldval = 'true';
        var fieldname = [];
        for (var x in this.assetstestcheckbox) {
            var tmp = this.assetstestcheckbox[x];
            if (this.assetstestcheckbox[x].checkboxvalue) {
                fieldname.push(this.assetstestcheckbox[x].fieldname);
            }
        }
        for (var x in this.assetstestcheckbox1) {
            var tmp = this.assetstestcheckbox1[x];
            if (this.assetstestcheckbox1[x].checkboxvalue) {
                fieldname.push(this.assetstestcheckbox1[x].fieldname);
            }
        }
        if (this.topcounter == undefined) {
            this.topcounter = '';
        }
        if(fieldname.length == 0){
            var message = 'Please select at least one test before proceeding.';
            this.homeService.confirmCancelImage('Asset Sample Error',message)
            return false;
        }
        var postdata = {
            barcode: this.barcode,
            accountid: this.userdata.accountid,
            act: 'save_sample',
            fieldname: fieldname,
            fieldval: fieldval,
            selectedSerialnumber: this.assetnameentrieselected,
            sample_date: this.sample_date,
            top_counter: this.topcounter,
            sample_oil_temperature: this.sample_oil_temperature,
            identification_comments: this.identification_comments,
            cf_job_number: this.cf_job_number,
            sample_due_date: this.sample_due_date,
            sample_id: this.barcode,
            asset_name: this.assetsentrieselected,
            contactid: this.userdata.username,
            customerid: this.userdata.id,
        };
        var headers = new HttpHeaders();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Access-Control-Allow-Origin", "*");
        this.homeService.showLoading();
        this.httpClient.post(this.apiurl + "OrderTests.php", JSON.stringify(postdata), {
            headers: headers,
            observe: "response",
        }).subscribe(async (data) => {
            this.homeService.hideLoading();
            var success = data["body"]["success"];
            if (success) {
                this.assetfilterlist = this.assetsentries;
                this.router.navigateByUrl('/home');
            }
        });
    }

    async clearTests(event) {
        for (var x in this.assetstestcheckbox) {
                this.assetstestcheckbox[x].checkboxvalue = 0;
        }
        for (var x in this.assetstestcheckbox1) {
            this.assetstestcheckbox1[x].checkboxvalue = 0;
        }
        this.selectedbundle = false;
    }

    async checkTest(event) {
        var asset_id = this.assetsentrieselected;
        if (asset_id == '') {
            this.homeService.presentToast('Please select an existing asset or create new one.');
            return;
        }
        if(this.selectedbundle === false){
            return true;
        }
        if(event.target.tagName == 'ION-CHECKBOX'){
            return true;
        }
        var a_temp = this.selectedbundle;
        var a_tempArr = a_temp.split(',');
        if (a_tempArr.length > 1) {
            for (var x in this.assetstestcheckbox) {
                if (this.assetstestcheckbox[x].isbundle == 0 && a_tempArr.indexOf(this.assetstestcheckbox[x].fieldname) !== -1) {
                    this.assetstestcheckbox[x].checkboxvalue = 1;
                } else {
                    if (this.assetstestcheckbox[x].isbundle == 1 && this.assetstestcheckbox[x].fieldname == a_temp) {
                        this.assetstestcheckbox[x].checkboxvalue = 1;
                    } else {
                        this.assetstestcheckbox[x].checkboxvalue = 0;
                    }
                }
            }

            for (var x in this.assetstestcheckbox1) {
                if (this.assetstestcheckbox1[x].isbundle == 0 && a_tempArr.indexOf(this.assetstestcheckbox1[x].fieldname) !== -1) {
                    this.assetstestcheckbox1[x].checkboxvalue = 1;
                } else {
                    if (this.assetstestcheckbox1[x].isbundle == 1 && this.assetstestcheckbox1[x].fieldname == a_temp) {
                        this.assetstestcheckbox1[x].checkboxvalue = 1;
                    } else {
                        this.assetstestcheckbox1[x].checkboxvalue = 0;
                    }
                }
            }
        }
    }

    async createinspection() {
        var postdata = {
            asset_id: this.assetsentrieselected,
            mode: 'GetAssetData'
        };
        var headers = new HttpHeaders();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Access-Control-Allow-Origin", "*");
        this.homeService.showLoading();
        this.httpClient.post(this.apiurl + "UpdateAsset.php", JSON.stringify(postdata), {
            headers: headers,
            observe: "response",
        })
            .subscribe(async (data) => {
                this.homeService.hideLoading();
                var success = data["body"]["success"];

                if (success == true) {
                    var cf_937 = data["body"]['data']['cf_937'];
                    var cf_938 = data["body"]['data']['cf_938'];
                    var cf_939 = data["body"]['data']['cf_939'];
                    var cf_1148 = data["body"]['data']['cf_1148'];
                    var cf_1149 = data["body"]['data']['cf_1149'];
                    var cf_1150 = data["body"]['data']['cf_1150'];
                    var cf_1151 = data["body"]['data']['cf_1151'];
                    var cf_1152 = data["body"]['data']['cf_1152'];
                    var cf_1153 = data["body"]['data']['cf_1153'];
                    var cf_1154 = data["body"]['data']['cf_1154'];
                    var cf_1155 = data["body"]['data']['cf_1155'];
                    var cf_1156 = data["body"]['data']['cf_1156'];
                    const modal_createinspection = await this.modalCtrl.create({
                        component: CreateinspectionPage,
                        componentProps: {
                            paramTitle: 'Create Your Inspection',
                            assetsentrieselected: this.assetsentrieselected,
                            cf_937: cf_937,
                            cf_938: cf_938,
                            cf_939: cf_939,
                            cf_1148: cf_1148,
                            cf_1149: cf_1149,
                            cf_1150: cf_1150,
                            cf_1151: cf_1151,
                            cf_1152: cf_1152,
                            cf_1153: cf_1153,
                            cf_1154: cf_1154,
                            cf_1155: cf_1155,
                            cf_1156: cf_1156,
                        },
                    });
                    modal_createinspection.onDidDismiss().then((dataReturned) => {
                        console.log('Inspection-Form-dataReturned = ', dataReturned);
                    });
                    return await modal_createinspection.present();
                }
            });
    }

    async selecteasset(assetid) {

        this.assetsentrieselected = assetid;
        var selectedRecord = await this.assetfilterlist.find(o => o.assetid === assetid);
        this.assetfilterlist = [];
        this.assetfilterlist[0] = selectedRecord;
        this.equipmenttype = this.assetfilterlist[0]['cf_922'];
        this.assetnameentrieselected = this.assetfilterlist[0]['assetname'];
        var postdata = {
            act: 'list_tests',
            asset_name: this.assetsentrieselected,
            sample_id: this.barcode
        };
        var headers = new HttpHeaders();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Access-Control-Allow-Origin", "*");
        this.homeService.showLoading();
        this.httpClient.post(this.apiurl + "OrderTests.php", JSON.stringify(postdata), {
            headers: headers,
            observe: "response",
        })
            .subscribe(async (data) => {
                this.homeService.hideLoading();
                var success = data["body"]["success"];
                var response = data["body"]['data'];
                if (success) {
                    if (response['cf_opcounter_type']) {
                        this.topcounter = response['cf_opcounter'];
                        this.istapcounterreading = 1;
                    } else {
                        this.topcounter = '';
                        this.istapcounterreading = 0;
                    }

                    for (var i = 0; i < this.assetfilterlist.length; i++) {
                        if (this.assetfilterlist[i].assetid == this.assetsentrieselected) {
                            var imortant_note = this.assetfilterlist.splice(i, 1);
                            this.assetfilterlist.unshift(imortant_note[0]);
                        }
                    }
                }

            });
    }

    async createasset() {
        const modal_createasset = await this.modalCtrl.create({
            component: CreateassetPage,
            componentProps: {
                paramTitle: 'Create Your Asset',
                list_locations: this.list_locations,
                selectedbarcode: this.barcodenumberasset,
            },
        });
        modal_createasset.onDidDismiss().then((dataReturned) => {
            if (dataReturned['data']['newasset'][0] !== undefined) {
                this.assetfilterlist.push(dataReturned['data']['newasset'][0]);
                this.assetsentries.push(dataReturned['data']['newasset'][0]);
                this.searchassetflag = 0;
                this.selecteasset(dataReturned['data']['newasset'][0]['assetid']);
            }
        });
        return await modal_createasset.present();
    }

    async getbarcodenumberasset() {
        var self = this;
        clearTimeout(this.timer);
        var ms = 500; // milliseconds
        this.timer = setTimeout(function() {
            self.getbarcodenumberassetclick();
        }, ms);
    }
    getbarcodenumberassetclick() {

        var searchTerm = this.barcodenumberasset;
        if(searchTerm != ''){
            var postdata = {
                act: 'get_list_assets',
                accountid: this.userdata.accountid,
                search_column : this.assetfilter,
                search_value : searchTerm,
            };
            var headers = new HttpHeaders();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("Access-Control-Allow-Origin", "*");

            this.httpClient.post(this.apiurl + "OrderTests.php", JSON.stringify(postdata), {
                headers: headers,
                observe: "response",
            }).subscribe(async (data) => {
                this.homeService.hideLoading();
                var responseData = data['body']['data'];
                var responseError = data['body']['error'];
                if(!responseError){
                    var res = [];
                    for (var x in responseData.entries){
                        responseData.entries.hasOwnProperty(x) && res.push(responseData.entries[x]);
                    }
                    this.assetfilterlist = res;
                    this.searchassetflag = 0;
                }else{
                    this.assetfilterlist = [];
                    this.searchassetflag = 1;
                }
            });
        }else{
            this.assetfilterlist = this.assetsentries;
            this.searchassetflag = 0;
        }
    }

    openActionSheet(index, section) {
        var options: CameraOptions = {
            quality: 70,
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/png;base64,' + imageData;
            this.cropImage(base64Image)
        }, (err) => {
            this.homeService.presentToast('Error in showing image' + err);
        });
    }

    async cropImage(imageData) {
        const modal_createasset = await this.modalCtrl.create({
            component: ImageeditorPage,
            componentProps: {
                paramTitle: 'Create Your Asset',
                base64Data: imageData,
            },
        });
        modal_createasset.onDidDismiss().then((dataReturned) => {
            if (dataReturned.data != undefined) {
                if (dataReturned.data.base64Croped != undefined) {
                    this.ocrScanImage(dataReturned.data.base64Croped)
                }
            }
        });
        return await modal_createasset.present();
    }

    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    async ocrScanImage(base64Image) {
        var blob = await this.dataURLtoBlob(base64Image);
        var formData = new FormData();
            formData.append("blob", blob);
            formData.append("name", 'imagefromapp');


        var headers = new HttpHeaders();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Access-Control-Allow-Origin", "*");
        this.homeService.showLoading();
        this.httpClient.post(this.apiurl + "scanImage.php", formData, {
            headers: headers,
            observe: "response",
        })
            .subscribe(async (data) => {
                this.homeService.hideLoading();
                var success = data["body"]["success"];
                if(success){
                    var response = data["body"]['message'];
                    this.barcodenumberasset = response;
                }else{
                    this.homeService.presentToast(data["body"]['message']);
                    return;
                }
            });
    }
}