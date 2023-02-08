import { Component } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from './services/seller.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers

})
export class AppComponent {
  title = 'Shell-to-Shore';
  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  // constructor(private seller:SellerService){

  // }
  // ngOnInit():void{
  //   this.seller.reloadSeller()
  // }

}
