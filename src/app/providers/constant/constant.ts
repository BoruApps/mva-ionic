import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
    workOrder: object = {};
    apiurl : string = 'https://mvaser.com/phoneapi_ionic/';
    vturl : string = 'https://mvaser.com/';
    
    getApiUrl() {
        return this.apiurl;
    }
    getVtUrl() {
        return this.vturl;
    }
}
