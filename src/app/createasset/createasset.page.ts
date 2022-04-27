import { Component, OnInit} from '@angular/core';
import { ModalController, NavParams, ToastController, PickerController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-createasset',
  templateUrl: './createasset.page.html',
  styleUrls: ['./createasset.page.scss'],
})
export class CreateassetPage implements OnInit {
	modalTitle: string;
	AssetfieldList: any[] = [];
	list_locations: any[] = [];
  constructor(
  	private navParams: NavParams,
  	public toastController: ToastController,
  	public loadingController: LoadingController,
  	private modalController: ModalController,
  ) { }

  ngOnInit() {
  	this.modalTitle = this.navParams.data.paramTitle;
  	this.list_locations = this.navParams.data.list_locations;
  	console.log('list_locations == ',this.list_locations);
  	this.AssetfieldList = [];
  	this.AssetfieldList.push({ 
        label : 'Serial Number',
        fieldname : 'assetname',
        uitype : 1,
        typeofdata : 'V~M',
        value : ''
    },{ 
        label : 'Company',
        fieldname : 'account',
        uitype : 1,
        typeofdata : 'V~0',
        value : ''
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
	async submitinstallationcompletionform(){
        var formflag = await this.checkrequiredfields();
        console.log('formflag = ', formflag);
        /*if(formflag){
            console.log('this.InstallfieldList = ',this.InstallfieldList);
            var headers = new HttpHeaders();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("Access-Control-Allow-Origin", "*");
            const base64Data = this.signaturePad.toDataURL();
            this.signatureImg = base64Data;
            var base64Datapost = base64Data.split(',')[1];
            // 'base64Image': base64Datapost,
            this.showLoading();
            var params = {
                'base64Image': base64Datapost,
                'InstallfieldList': JSON.stringify(this.InstallfieldList),
                'recordid': this.serviceid,
                'logged_in_user': this.user_id,
                'blockname': this.blockname,
            };
            this.httpClient
            .post(this.apiurl + "saveInstallationform.php", params, {
              headers: headers,
              observe: "response",
            })
            .subscribe(
              (data) => {
                this.hideLoading();
                var success = data["body"]["success"];
                console.log(data["body"]);
                if (success == true) {
                    console.log("Saved and updated data for workorder");
                    //localStorage.removeItem(this.localInstallform);
                    this.clearPad();
                    localStorage.setItem(this.localInstallform, JSON.stringify(this.InstallfieldList));
                    localStorage.setItem(this.localInstallformdate, this.currentdate);
                    this.modalController.dismiss({'formsubmitted':true});
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
        }*/
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
