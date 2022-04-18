import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
    workOrder: object = {};
    apiurl : string = 'https://devl06.borugroup.com/mvagit/phoneapi_ionic/';
    vturl : string = 'https://devl06.borugroup.com/mvagit/';
    
    getApiUrl() {
        return this.apiurl;
    }
    getVtUrl() {
        return this.vturl;
    }
}
