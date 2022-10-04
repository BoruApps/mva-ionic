import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModalController, NavParams, ToastController, PickerController, NavController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';
import 'hammerjs';
import {ImageCroppedEvent, ImageCropperModule} from 'ngx-image-cropper';
import { Dimensions, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';

@Component({
    selector: 'app-imageeditor',
    templateUrl: './imageeditor.page.html',
    styleUrls: ['./imageeditor.page.css'],
})
export class ImageeditorPage implements OnInit {

    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};


    apiurl: any;
    vturl: any;
    userdata: any;

    imageChangedEvent: any = '';
    croppedImage: any = '';
    imageBase64String: any = '';
    coordinates={x1: 50, y1: 200, x2: 300, y2: 300};
    
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

        await this.isLogged().then(response => {
            if (response !== false) {
                this.userdata = response;
                this.imageBase64String = this.navParams.data.base64Data;
            } else {
                this.presentToast('Login failed. Please try again');
                this.logoutUser();
            }
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
            if (this.loading != undefined) {
                this.loading.dismiss();
            }
        }, 1000);
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
    
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded() {
        setTimeout(() => {
            this.coordinates={x1: 50, y1: 200, x2: 300, y2: 300};
        }, 500);
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    async closeModal(changes = '') {
        await this.modalController.dismiss({});
    }
    
    async saveModal(changes = '') {
        await this.modalController.dismiss({'base64Croped': this.croppedImage});
    }
}