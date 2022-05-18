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
    topcounter: any;
    userdata: any;
    barcode: any;
    assetfilter: any = 'serialnumber';
    assetsentrieselected: any;
    selectedbundle: any;
    croppedImagepath = "";
    assetsentries: any = [];
    assetfilterlist = [];
    assetstestcheckbox = [];
    assetstestcheckbox1 = [];
    list_locations = [];
    searchassetflag = 0;
    iscreateasset = 0;
    istapcounterreading = 0;

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
        private file: File
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
        this.storage.get('assetsentrieselected').then((assetsentrieselected) => {
            this.assetsentrieselected = assetsentrieselected;
        });
        this.storage.get('assetsentries').then((assetsentries) => {
            this.assetsentries = assetsentries;
            this.assetfilterlist = assetsentries;
            for (var i = 0; i < this.assetfilterlist.length; i++) {
                if (this.assetfilterlist[i].assetid == this.assetsentrieselected) {
                    var imortant_note = this.assetfilterlist.splice(i, 1);
                    this.assetfilterlist.unshift(imortant_note[0]);
                }
            }
        });


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
        this.storage.get('assetstestcheckbox1').then((assetstestcheckbox1) => {
            this.assetstestcheckbox1 = assetstestcheckbox1;
            for (var x in this.assetstestcheckbox1) {
                var tmp = this.assetstestcheckbox1[x];
                if (tmp.isbundle == 1 && this.assetstestcheckbox1[x].checkboxvalue) {
                    this.selectedbundle = this.assetstestcheckbox1[x].fieldname;
                }
            }
        });
        this.storage.get('list_locations').then((list_locations) => {
            this.list_locations = list_locations;
        });
        this.storage.get('assetstestcheckbox').then((assetstestcheckbox) => {
            this.assetstestcheckbox = assetstestcheckbox;
            for (var x in this.assetstestcheckbox) {
                var tmp = this.assetstestcheckbox[x];
                if (tmp.isbundle == 1 && this.assetstestcheckbox[x].checkboxvalue) {
                    this.selectedbundle = this.assetstestcheckbox[x].fieldname;
                }
            }
        });
        this.storage.get('userdata').then((userdata) => {
        });
        this.storage.get('barcode').then((barcode) => {
            this.barcode = barcode;
        });
        this.storage.get('assetsmessage').then((assetsmessage) => {
            if (assetsmessage != 'TEST') {
                this.confirmCancelImage('Warning message', assetsmessage);
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

    async confirmCancelImage(header, message) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: header,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                },
            ]
        });

        await alert.present();
    }
    async doRefresh(event) {
        this.barcodenumberasset = '';
        this.ngOnInit();
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
            sample_due_date: this.sample_due_date,
            sample_id: this.barcode,
            asset_name: this.assetsentrieselected,
            contactid: this.userdata.username,
            customerid: this.userdata.id,
        };
        console.log('postdata === ', postdata);
        var headers = new HttpHeaders();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Access-Control-Allow-Origin", "*");
        this.showLoading();
        this.httpClient.post(this.apiurl + "OrderTests.php", JSON.stringify(postdata), {
            headers: headers,
            observe: "response",
        }).subscribe(async (data) => {
            this.hideLoading();
            var success = data["body"]["success"];
            console.log('save == ', data);
            console.log('save-success == ', success);
            if (success) {
                this.assetfilterlist = this.assetsentries;
                this.router.navigateByUrl('/home');
            }
        });
    }

    async clearTests(event) {
        for (var x in this.assetstestcheckbox) {
            var tmp = this.assetstestcheckbox[x];
            if (tmp.isbundle == 0) {
                this.assetstestcheckbox[x].checkboxvalue = 0;
            }
        }
        for (var x in this.assetstestcheckbox1) {
            var tmp = this.assetstestcheckbox1[x];
            if (tmp.isbundle == 0) {
                this.assetstestcheckbox1[x].checkboxvalue = 0;
            }
        }
        this.selectedbundle = '';
    }

    async checkTest(event) {
        var asset_id = this.assetsentrieselected;
        if (asset_id == '') {
            this.presentToast('Please select an existing asset or create new one.');
            return;
        }
        var a_temp = event.target.value;
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
        this.showLoading();
        this.httpClient.post(this.apiurl + "UpdateAsset.php", JSON.stringify(postdata), {
            headers: headers,
            observe: "response",
        })
            .subscribe(async (data) => {
                this.hideLoading();
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
        console.log('selecteasset - assetsentries-assetid = ',assetid);
        console.log('selecteasset - assetsentries = ',this.assetsentries);
        this.assetfilterlist = this.assetsentries.filter((asset) => {
        console.log('selecteasset - assetsentries- asset = ',asset);
            if (assetid === undefined) {
                return false
            }
            return asset.assetid.toLowerCase().indexOf(assetid.toLowerCase()) > -1;

        });
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
        this.showLoading();
        this.httpClient.post(this.apiurl + "OrderTests.php", JSON.stringify(postdata), {
            headers: headers,
            observe: "response",
        })
            .subscribe(async (data) => {
                this.hideLoading();
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
            }
        });
        return await modal_createasset.present();
    }

    async getbarcodenumberasset() {
        var searchTerm = this.barcodenumberasset;
        console.log('this.barcodenumberasset == ',this.barcodenumberasset)
        console.log('this.assetsentries == ',this.assetsentries)
        this.assetfilterlist = this.assetsentries.filter((asset) => {
            if (searchTerm === undefined) {
                return false
            }
            if (this.assetfilter == 'serialnumber') {
                if(asset.assetname == null){
                    return false
                }
                return asset.assetname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            } else if (this.assetfilter == 'unitid') {
                if(asset.cf_1164 == null){
                    return false
                }
                return asset.cf_1164.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            } else if (this.assetfilter == 'equipmentid') {
                if(asset.cf_922 == null){
                    return false
                }
                return asset.cf_922.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            } else if (this.assetfilter == 'substationname') {
                if(asset.multiaddressid == null){
                    return false
                }
                return asset.multiaddressid.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            }
        });
        if (this.assetfilterlist.length == 0) {
            this.searchassetflag = 1;
        } else {
            this.searchassetflag = 0;
        }
        for (var i = 0; i < this.assetfilterlist.length; i++) {
            if (this.assetfilterlist[i].assetid == this.assetsentrieselected) {
                var imortant_note = this.assetfilterlist.splice(i, 1);
                this.assetfilterlist.unshift(imortant_note[0]);
            }
        }
    }

    openActionSheet(index, section) {
        var options: CameraOptions = {
            quality: 70,
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/png;base64,' + imageData;
            this.cropImage(base64Image)
        }, (err) => {
            this.presentToast('Error in showing image' + err);
        });
    }

    async cropImage(imageData) {
        console.log('cropImage imageData', imageData)
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
        this.showLoading();
        this.httpClient.post(this.apiurl + "scanImage.php", formData, {
            headers: headers,
            observe: "response",
        })
            .subscribe(async (data) => {
                this.hideLoading();
                var success = data["body"]["success"];
                if(success){
                    var response = data["body"]['message'];
                    this.barcodenumberasset = response;
                }else{
                    this.presentToast(data["body"]['message']);
                    return;
                }
            });
    }
}