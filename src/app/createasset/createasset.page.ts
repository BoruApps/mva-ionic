import { Component, OnInit} from '@angular/core';
import { ModalController, NavParams, ToastController, PickerController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';

@Component({
  selector: 'app-createasset',
  templateUrl: './createasset.page.html',
  styleUrls: ['./createasset.page.scss'],
})
export class CreateassetPage implements OnInit {
	apiurl: any;
    vturl: any;
	modalTitle: string;
	selectedbarcode: string;
	barcode: string;
	AssetfieldList: any[] = [];
	list_locations: any[] = [];
	userdata = [];
  constructor(
  	private navParams: NavParams,
  	public storage: Storage,
  	public toastController: ToastController,
  	public loadingController: LoadingController,
  	private modalController: ModalController,
  	private httpClient: HttpClient,
  	public appConst: AppConstants,
  ) { 
  	this.apiurl = this.appConst.getApiUrl();
    this.vturl = this.appConst.getVtUrl();
  }

  async ngOnInit() {
  	this.modalTitle = this.navParams.data.paramTitle;
  	this.list_locations = this.navParams.data.list_locations;
  	this.selectedbarcode = this.navParams.data.selectedbarcode;
  	console.log('list_locations == ',this.list_locations);
  	await this.storage.get('userdata').then((userdata) => {
  		this.userdata = userdata;
    });
    await this.storage.get('barcode').then((barcode) => {
      this.barcode = barcode;
    });
  	console.log('userdata',this.userdata)
  	console.log('userdata-accountid',this.userdata['accountid'])
  	console.log('userdata-accountname',this.userdata['accountname'])
  	this.AssetfieldList = [];
  	this.AssetfieldList.push({ 
        label : 'Serial Number',
        fieldname : 'assetname',
        uitype : 1,
        typeofdata : 'V~M',
        value : this.selectedbarcode
    },{ 
        label : 'Company',
        fieldname : 'account_display',
        uitype : 11,
        typeofdata : 'V~0',
        value : this.userdata['accountname']
    },{ 
        label : 'Substation Location',
        fieldname : 'multiaddressid',
        uitype : 155,
        typeofdata : 'V~M',
        picklistvalues : this.list_locations,
    },{ 
        label : 'Unit ID',
        fieldname : 'cf_1164',
        uitype : 1,
        typeofdata : 'V~0',
        value : '',
    },{ 
        label : 'Status',
        fieldname : 'assetstatus',
        uitype : 15,
        typeofdata : 'V~0',
        picklistvalues: ['In Service','Out-of-service']
    },{ 
        label : 'Equipment Type',
        fieldname : 'cf_922',
        uitype : 15,
        typeofdata : 'V~0',
        picklistvalues: ['Transformer','Oil Circuit Breaker','Voltage Regulator','Furnace Transformer','Network Transformer','Current or Potential Transformer',
        'Recloser','Switch','Drum/Tank/Tote','Bushing','LTC - Unknown','LTC - Arcing Tap Changer, Selector Compartment','LTC - Arcing Tap Changer, Transfer Compartment','LTC - Arcing Tap Changer, Contacts in Single Compartment','LTC - Vacuum','Reactor','Exciter','Series','Cable','Rectifier/Precipitator','Other']
    },{ 
        label : 'Manufacturer',
        fieldname : 'cf_923',
        uitype : 15,
        typeofdata : 'V~0',
        picklistvalues: ['--None--','Westinghouse','WEG','Waukesha','Wagner','Virginia Transformer','Viking','VanTran','US Transformer','Toshiba','Tamini','TR Electric','T&amp;amp;R Electric','Square D','Sunbelt','Standard','Southwest Electric','Solomon Transformer','Sola Basic','SMIT','Siemens','SGB','SD Myers','Schneider','RTE','RE Uptegraff','Reinhausen','Pioneer','Pennsylvania Transformer','Pauwels','Packard','NWL','OTC','Ohio Transformer','Other','North American Transformer','Niagara Transformer','NEI','Moloney Electric','Mitsibushi','McGraw Edison','Magnetech','Kuhlman','JSHP','Jordan','Jerry&amp;#039;s Electric','ITE','Interstate','ILJIN','Hyundai','Hyosung','Howard','HK Porter','HICO','Hevi Duty','General Electric','GE Prolec','Fuji','Fortune Electric','Ferranti Packard','Ferranti','Federal Pacific','Fayetteville','ERMCO','Elgin','Elin','Efacec','Eaton','Delta Star','Cutler Hammer','Crompton Greaves','Cooper','Central Moloney','Carte','Brown Broveri','ATSCO','Asea','Areva','Alstom','Allis Chalmers','ABB','-- Not Reported --']
    },{ 
        label : 'Yr',
        fieldname : 'cf_924',
        uitype : 1,
        typeofdata : 'V~0',
        value:''
    },{ 
        label : 'Primary Voltage (KV)',
        fieldname : 'cf_925',
        uitype : 1,
        typeofdata : 'V~0',
        value:''
    },{ 
        label : 'Secondary Voltage (KV)',
        fieldname : 'cf_926',
        uitype : 1,
        typeofdata : 'V~0',
        value:''
    },{ 
        label : 'KVA Rating',
        fieldname : 'cf_927',
        uitype : 1,
        typeofdata : 'V~0',
        value:''
    },{ 
        label : 'Gals',
        fieldname : 'cf_928',
        uitype : 1,
        typeofdata : 'V~0',
        value:''
    },{ 
        label : 'Fluid Type',
        fieldname : 'cf_929',
        uitype : 15,
        typeofdata : 'V~0',
        picklistvalues: ['Mineral Oil','Natural Ester','Silicone','R-Temp','Perchloroethylene','Askarel','Synthetic Ester','Other']
    },{ 
        label : 'Phases',
        fieldname : 'cf_1150',
        uitype : 15,
        typeofdata : 'V~0',
        picklistvalues: ['-- Not Reported --','1','3']
    },{ 
        label : 'Breather Configuration',
        fieldname : 'cf_1151',
        uitype : 15,
        typeofdata : 'V~0',
        picklistvalues: ['-- Not Reported --','Sealed','Free Breather','Conservator','Free Breather with Desiccant']
    });
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
            if(this.loading != undefined){
                this.loading.dismiss();
            }
        }, 1000);
    }
    async closeModal(changes='') {
        await this.modalController.dismiss({'formsubmitted':false});
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
        console.log('AssetfieldList == ',this.AssetfieldList);
  }
  	setValuetoInstallfield(fieldname, value){
	    var flag = 0;
	    var timearrived = '';
	    var timefinished = '';
	    var old_hours_site = '';
	    for (var i = 0; i < this.AssetfieldList.length; ++i) {
	        if(this.AssetfieldList[i].fieldname === fieldname){
	            this.AssetfieldList[i]["value"] = value;
	        }
	        if(this.AssetfieldList[i]["value"] != '' && this.AssetfieldList[i]["value"] != undefined){
	            flag++;
	        }
	        if(this.AssetfieldList[i].fieldname == 'cf_time_arrived'){
	            timearrived = this.AssetfieldList[i]["value"]
	        }
	        if(this.AssetfieldList[i].fieldname == 'cf_time_finished'){
	            timefinished = this.AssetfieldList[i]["value"]
	        }
	        if(this.AssetfieldList[i].fieldname == 'cf_hours_site'){
	            old_hours_site = this.AssetfieldList[i]["value"]
	        }
	    }	
	}
	async submitform(){
        var formflag = await this.checkrequiredfields();

        console.log('formflag = ', formflag);
        console.log('AssetfieldList = ', this.AssetfieldList);
        var formdata = {};
        for (var i = 0; i < this.AssetfieldList.length; ++i) {
        	if(this.AssetfieldList[i]["value"] == undefined){
        		this.AssetfieldList[i]["value"] = '';
        	}
        	formdata[this.AssetfieldList[i].fieldname] = this.AssetfieldList[i]["value"];
        }
        formdata['account'] = this.userdata['accountid'];
        formdata['selectedbarcode'] = this.barcode;
        console.log('formdata = ', formdata);
        console.log('apiurl = ', this.apiurl);
        if(formflag){
            var headers = new HttpHeaders();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("Access-Control-Allow-Origin", "*");
            this.showLoading();
            console.log('formdata-stringify-formdata = ',formdata);
            console.log('formdata-stringify = ',JSON.stringify(formdata));
            this.httpClient.post(this.apiurl + "createasset.php", JSON.stringify(formdata), {
              headers: headers,
              observe: "response",
            })
            .subscribe(
              (data) => {
                this.hideLoading();
                console.log('create asset data = ',data)
                var success = data["body"]["success"];
                console.log(data["body"]);
                if (success == true) {
					this.presentToast("Asset created successfully");
					var newasset = [];
				  	newasset.push({
						assetid: data["body"]['data'],
						assetname: formdata['assetname'],
						cf_922: formdata['cf_922'],
						cf_923: formdata['cf_923'],
						cf_924: formdata['cf_924'],
						cf_925: formdata['cf_925'],
						cf_927: formdata['cf_927'],
						cf_928: formdata['cf_928'],
						cf_929: formdata['cf_929'],
						cf_1150: formdata['cf_1150'],
						cf_1164: formdata['cf_1164'],
						multiaddressid: formdata['multiaddressid']
					});
				  	console.log('newasset == ',newasset);
                    this.modalController.dismiss({'newasset':newasset});
                } else {
                  this.presentToast("Failed to save due to an error");
                  console.log("failed to save record, response was false");
                }
              },
              (error) => {
                this.presentToast(
                  "Failed to save due to an error \n" + error.message
                );
                console.log("failed to save record", error.message);
              }
            );
        }
    }
	async checkrequiredfields(){
	    var fieldlist = [];
	    var fieldlistmassge = '';
	    for (var i = 0; i < this.AssetfieldList.length; ++i) {
	        if((this.AssetfieldList[i]["value"] == '' || this.AssetfieldList[i]["value"] == undefined) && this.AssetfieldList[i]["typeofdata"] == 'V~M'){
	            fieldlist.push(this.AssetfieldList[i]["fieldname"]);
	            fieldlistmassge += 'This field is Required '+this.AssetfieldList[i]["label"] +'\n <br>';
	        }
	    }
	    if(fieldlistmassge == ''){
	        return true;
	    }else{
	        console.log('fieldlist = ',fieldlist);
	       	var input = document.getElementById(fieldlist[0]);
            console.log('input == ',input);
            input.scrollIntoView(true);
	        this.presentToast(
	            fieldlistmassge
	        );
	        return false;
	    }
	}
}
