import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-termconditions',
  templateUrl: './termconditions.page.html',
  styleUrls: ['./termconditions.page.scss'],
})
export class TermconditionsModal implements OnInit {

  constructor(
      public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }
  
  async closeModal(term=false) {
    await this.modalCtrl.dismiss({'term':term});
  }
}
