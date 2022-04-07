import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ToastController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  apiurl: any;
  vturl: any;
  public userdata: any;
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
    async presentToast(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 3500,
            position: "top",
            color: "danger"
        });
        toast.present();
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
    }

}
