import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModalController, NavParams, ToastController, PickerController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';

@Component({
    selector: 'app-create-location',
    templateUrl: './create-location.page.html',
    styleUrls: ['./create-location.page.scss'],
})
export class CreateLocationPage implements OnInit {

    apiurl: any;
    vturl: any;
    contactId: any;
    userdata: any;
    multiaddress: any = '';
    LocationfieldList: any[] = [];

    constructor(
        private router: Router,
        private navParams: NavParams,
        public toastController: ToastController,
        public loadingController: LoadingController,
        private modalController: ModalController,
        private httpClient: HttpClient,
        public appConst: AppConstants,
        public storage: Storage,
    ) {
        this.apiurl = this.appConst.getApiUrl();
        this.vturl = this.appConst.getVtUrl();
    }

    async ngOnInit() {
        await this.storage.create();
        this.multiaddress = this.navParams.data.multiaddress;
        await this.isLogged().then(response => {
            if (response !== false) {
                this.userdata = response;
            } else {
                this.presentToast('Login failed. Please try again');
                this.logoutUser();
            }
        });

        this.LocationfieldList = [];
        this.LocationfieldList.push({
            label: 'Address Line 1',
            fieldname: 'address1',
            uitype: 1,
            typeofdata: 'V~M',
            value: this.multiaddress
        }, {
            label: 'Address Line 2',
            fieldname: 'address2',
            uitype: 1,
            typeofdata: 'V~0',
            value: ''
        }, {
            label: 'City',
            fieldname: 'city',
            uitype: 1,
            typeofdata: 'V~0',
            value: ''
        }, {
            label: 'State',
            fieldname: 'state',
            uitype: 1,
            typeofdata: 'V~0',
            value: ''
        }, {
            label: 'Postal Code',
            fieldname: 'zip',
            uitype: 1,
            typeofdata: 'V~0',
            value: ''
        }, {
            label: 'Account Name',
            fieldname: 'cf_account',
            uitype: 10,
            typeofdata: 'V~0',
            value: this.userdata.accountid,
            displayValue: this.userdata.accountname
        });

        console.log('this.userdata', this.userdata.accountname)
    }

    loading: any;

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

    async closeModal(changes = '') {
        console.log('closeModal - location');
        await this.modalController.dismiss();
    }

    async presentToast(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 2000,
            position: "top",
            color: "danger",
        });
        toast.present();
    }

    async presentToastPrimary(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 2000,
            position: 'bottom',
            color: 'primary'
        });
        toast.present();
    }

    async isLogged() {
        var log_status = await this.storage.get('userdata').then((userdata) => {
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

    addUpdate(event, extra = null) {
        var fieldname = event.target.name;
        if (!fieldname || fieldname == "" || fieldname == undefined) {
            fieldname = event.target.id;
        }
        var fieldvalue = event.target.textContent + event.target.value;
        if (event.target.tagName == "ION-RADIO" || event.target.tagName == "ION-CHECKBOX" || event.target.tagName == "ION-DATETIME" || event.target.tagName == "ION-TEXTAREA" || event.target.tagName == "ION-SELECT") {
            fieldvalue = event.target.value;
        }

        for (var i = 0; i < this.LocationfieldList.length; ++i) {
            if (this.LocationfieldList[i].fieldname === fieldname) {
                this.LocationfieldList[i]["value"] = fieldvalue;
            }
        }
    }

    async submitLocationForm() {
        var formflag = await this.checkrequiredfields();

        console.log('this.userdata.userid', this.userdata)
        console.log('this.userdata.userid', this.userdata.userid)

        if (formflag) {
            console.log('this.InstallfieldList = ', this.LocationfieldList);
            var headers = new HttpHeaders();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("Access-Control-Allow-Origin", "*");

            var params = {
                'curContactId': atob(this.userdata.id)
            };

            for (var i = 0; i < this.LocationfieldList.length; ++i) {
                params[this.LocationfieldList[i].fieldname] = this.LocationfieldList[i].value;
            }

            this.showLoading();

            this.httpClient.post(this.apiurl + "createsubstation.php", params, {
                headers: headers,
                observe: "response",
            }).subscribe(
                (data) => {
                    this.hideLoading();
                    var success = data["body"]["success"];
                    var data = data["body"]["data"];
                    if (success == true) {
                        this.presentToastPrimary('Location saved!');
                        this.modalController.dismiss(data);
                    } else {
                        this.presentToast("Failed to save due to an error");
                    }
                },
                (error) => {
                    this.presentToast(
                        "Failed to save due to an error \n" + error.message
                    );
                }
            );
        }
    }

    async checkrequiredfields() {
        var fieldlist = [];
        var fieldlistmassge = '';
        for (var i = 0; i < this.LocationfieldList.length; ++i) {
            if ((this.LocationfieldList[i]["value"] == '' || this.LocationfieldList[i]["value"] == undefined) && this.LocationfieldList[i]["typeofdata"] == 'V~M') {
                fieldlist.push(this.LocationfieldList[i]["fieldname"]);
                fieldlistmassge += this.LocationfieldList[i]["label"] + ' is Required\n <br>';
            }
        }
        if (fieldlistmassge == '') {
            return true;
        } else {
            var input = document.getElementById(fieldlist[0]);
            input.scrollIntoView(true);
            this.presentToast(
                fieldlistmassge
            );
            return false;
        }
    }
}
