import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertController, ModalController, NavParams, ToastController, PickerController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';

@Component({
  selector: 'app-createinspection',
  templateUrl: './createinspection.page.html',
  styleUrls: ['./createinspection.page.scss'],
})
export class CreateinspectionPage implements OnInit {
	apiurl: any;
    vturl: any;
    userdata: any;
    loading: any;
    cf_937 : any;
	cf_938 : any;
	cf_939 : any;
	cf_1148 : any;
	cf_1149 : any;
	cf_1150 : any;
	cf_1151 : any;
	cf_1152 : any;
	cf_1153 : any;
	cf_1154 : any;
	cf_1156 : any;
	barcode : any;
	assetsentrieselected : any;
	modalTitle: string;
	inspectionfieldList: any[] = [];
	constructor(
		private navParams: NavParams,
		private router: Router,
	  	public storage: Storage,
	  	public toastController: ToastController,
	  	public loadingController: LoadingController,
	  	private modalController: ModalController,
	  	public alertController: AlertController,
	  	private httpClient: HttpClient,
	  	public appConst: AppConstants,
		) { 
		this.apiurl = this.appConst.getApiUrl();
    	this.vturl = this.appConst.getVtUrl();
	}

	async ngOnInit() {
		await this.isLogged().then(response => {
            if (response !== false) {
                this.userdata = response;
            } else {
                this.presentToast('Login failed. Please try again');
                this.logoutUser();
            }
        });
		this.modalTitle = this.navParams.data.paramTitle;
		this.assetsentrieselected = this.navParams.data.assetsentrieselected;
		this.barcode = this.navParams.data.barcode;
		this.cf_937 = this.navParams.data.cf_937;
		this.cf_938 = this.navParams.data.cf_938;
		this.cf_939 = this.navParams.data.cf_939;
		this.cf_1148 = this.navParams.data.cf_1148;
		this.cf_1149 = this.navParams.data.cf_1149;
		this.cf_1150 = this.navParams.data.cf_1150;
		this.cf_1151 = this.navParams.data.cf_1151;
		this.cf_1152 = this.navParams.data.cf_1152;
		this.cf_1153 = this.navParams.data.cf_1153;
		this.cf_1154 = this.navParams.data.cf_1154;
		this.cf_1156 = this.navParams.data.cf_1156;
		this.inspectionfieldList = [];

	  	this.inspectionfieldList.push({ 
	        label : 'Top Valve (in)',
	        fieldname : 'cf_937',
	        uitype : 1,
	        typeofdata : 'V~O',
	        value : this.cf_937
	    },{ 
	        label : 'Bottom Valve (in)',
	        fieldname : 'cf_938',
	        uitype : 1,
	        typeofdata : 'V~0',
	        value : this.cf_938
	    },{ 
	        label : 'Hose Length (ft)',
	        fieldname : 'cf_939',
	        uitype : 1,
	        typeofdata : 'V~0',
	        value : this.cf_939
	    },{ 
	        label : 'Paint Condition',
	        fieldname : 'cf_1148',
	        uitype : 15,
	        typeofdata : 'V~0',
	        value : this.cf_1148,
	        picklistvalues : ['Good','Fair','Poor','-- Not Reported --']
	    },{ 
	        label : 'Conservator Tank',
	        fieldname : 'cf_1149',
	        uitype : 15,
	        typeofdata : 'V~0',
	        value : this.cf_1149,
	        picklistvalues : ['-- Not Reported --','Yes','No','None']
	    },{ 
	        label : 'Bushings Enclosed',
	        fieldname : 'cf_1152',
	        uitype : 15,
	        typeofdata : 'V~0',
	        value: this.cf_1152,
	        picklistvalues : ['-- Not Reported --','Yes','No']
	    },{ 
	        label : 'Leaks',
	        fieldname : 'cf_1153',
	        uitype : 15,
	        typeofdata : 'V~0',
	        value: this.cf_1153,
	        picklistvalues : ['-- Not Reported --','Yes','No']
	    },{ 
	        label : 'Radiators',
	        fieldname : 'cf_1154',
	        uitype : 15,
	        typeofdata : 'V~0',
	        value: this.cf_1154,
	        picklistvalues : ['-- Not Reported --','Yes','No']
	    },{ 
	        label : 'Compartments',
	        fieldname : 'cf_1156',
	        uitype : 15,
	        typeofdata : 'V~0',
	        value: this.cf_1156,
	        picklistvalues : ['-- Not Reported --','Yes','No']
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
    async confirmbox(header,message){
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
	async closeModal(changes='') {
        await this.modalController.dismiss({'formsubmitted':false});
    }
	addUpdate(event, extra=null) {
		var fieldname = event.target.name;
		if (!fieldname || fieldname == "" || fieldname == undefined) {
			fieldname = event.target.id;
		}
		var fieldvalue = event.target.textContent + event.target.value;
		if (event.target.tagName == "ION-RADIO" || event.target.tagName == "ION-CHECKBOX" || event.target.tagName == "ION-DATETIME" || event.target.tagName == "ION-TEXTAREA" || event.target.tagName == "ION-SELECT")
		{
			fieldvalue = event.target.value;
		}
		console.log('No Need to display Image', fieldname);


		this.setValuetoInstallfield(fieldname, fieldvalue);
		console.log('tagName = ',event.target.tagName);
		console.log('fieldname = ',fieldname);
		console.log('fieldvalue = ',fieldvalue);
		console.log('inspectionfieldList == ',this.inspectionfieldList);
	}
	setValuetoInstallfield(fieldname, value){
		var flag = 0;
		var timearrived = '';
		var timefinished = '';
		var old_hours_site = '';
		for (var i = 0; i < this.inspectionfieldList.length; ++i) {
		    if(this.inspectionfieldList[i].fieldname === fieldname){
		        this.inspectionfieldList[i]["value"] = value;
		    }
		    if(this.inspectionfieldList[i]["value"] != '' && this.inspectionfieldList[i]["value"] != undefined){
		        flag++;
		    }
		    if(this.inspectionfieldList[i].fieldname == 'cf_time_arrived'){
		        timearrived = this.inspectionfieldList[i]["value"]
		    }
		    if(this.inspectionfieldList[i].fieldname == 'cf_time_finished'){
		        timefinished = this.inspectionfieldList[i]["value"]
		    }
		    if(this.inspectionfieldList[i].fieldname == 'cf_hours_site'){
		        old_hours_site = this.inspectionfieldList[i]["value"]
		    }
		}	
	}
    async submitform(){
    	if(this.assetsentrieselected == '' && this.assetsentrieselected == undefined){
    		this.presentToast('Please select an existing asset or create new one.');
    		return false;
    	}
    	var formdata = {};
        for (var i = 0; i < this.inspectionfieldList.length; ++i) {
        	if(this.inspectionfieldList[i]["value"] == undefined){
        		this.inspectionfieldList[i]["value"] = '';
        	}
        	formdata[this.inspectionfieldList[i].fieldname] = this.inspectionfieldList[i]["value"];
        }
        var postdata = {
			asset_id: this.assetsentrieselected,
			formData : formdata,
			mode:'UpdateAsset'
		};
        this.showLoading();
        var headers = new HttpHeaders();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("Access-Control-Allow-Origin", "*");
        this.httpClient.post(this.apiurl + "UpdateAsset.php", JSON.stringify(postdata), {
          headers: headers,
          observe: "response",
        }).subscribe(async (data) => {
            this.hideLoading();
            console.log('Get Asset Data == ',data)
            var success = data["body"]["success"];
            if(success == true){
            	this.modalController.dismiss({'formsubmitted':true});
            	this.confirmbox('Asset updated successfully!', 'Please click "Save" to log in your Sample.')
            }
            console.log('success-create form',success);
        });
    }
}
