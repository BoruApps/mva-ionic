import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";

@Component({
  selector: 'app-confirmationmodel',
  templateUrl: './confirmationmodel.page.html',
  styleUrls: ['./confirmationmodel.page.scss'],
})
export class ConfirmationModal implements OnInit {

  header: any = '';
  message: any = '';

  constructor(
      public modalCtrl: ModalController,
      private navParams: NavParams
  ) { }

  ngOnInit() {
    this.header = this.navParams.data.header;
    this.message = this.navParams.data.message;
  }
  
  async closeModal(term=false) {
    await this.modalCtrl.dismiss({'term':term});
  }
}
