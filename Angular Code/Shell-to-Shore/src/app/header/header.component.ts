import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers

})
export class HeaderComponent implements OnInit {
  
  show: boolean = false;
  menuType: string = 'default';
  sellerName: string = '';
  searchResult: undefined | product[];
  userName: string = "";
  //for remove from cart
  // cartData:any;
  cardData:any=[];
  cartItems=0;  //by deflt vlue of items  ll be 0
  constructor(config: NgbCarouselConfig, private router: Router, private product: ProductService, private http: HttpClient) {
    // config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  //from video code//////////
 
  // ngOnInit(): void {
  //   this.router.events.subscribe((val: any) => {
  //     if (val.url) {
  //       if (localStorage.getItem('seller') && val.url.includes('seller')) {
  //        let sellerStore=localStorage.getItem('seller');
  //        let sellerData =sellerStore && JSON.parse(sellerStore)[0];
  //        this.sellerName=sellerData.name;
  //         this.menuType = 'seller';
  //       }
  //       else if(localStorage.getItem('user')){
  //         let userStore = localStorage.getItem('user');
  //         let userData = userStore && JSON.parse(userStore);
  //         this.userName= userData.name;
  //         this.menuType='user';
  //       }
  //        else {
  //         this.menuType = 'default';
  //       }
  //     }
  //   });
  //   }
  //code by sir//////////

  ngOnInit(): void {
    this.getAllcart();
    if (localStorage.getItem('seller')) {
      let sellerStore = localStorage.getItem('seller');
      let sellerData = sellerStore && JSON.parse(sellerStore)[0]; //to disply user's name
      this.sellerName  = sellerData.name;
    }    
    
  }
  onSeller() { 
    if (this.menuType = 'seller') {
      this.show = true;
    }
    else if (localStorage.getItem('user')) {
      let userStore = localStorage.getItem('user');
      let userData = userStore && JSON.parse(userStore);
      this.userName = userData.name;
      this.menuType = 'user';
      this.product.getCartList(userData.id)  //cart updatn ll also show on header 
    }
    else {
      this.menuType = 'default'
      this.show = true;
    }

    //.......................remove from cart..........................
    let cartData= localStorage.getItem('localCart');
    if(cartData){
      this.cartItems=JSON.parse(cartData).length // to add quantity in cart()
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems= items.length //kitna v quantity add krne pr data uodate rhega no need to refresh agn n agn
    })

  }


  // LOGOUT Function CODES
  logout() {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);  //redirect to header page i.e index
  }
  userLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/user-auth']);  //redirect to header page i.e index
    this.product.cartData.emit([]);
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProducts(element.value).subscribe((result) => {
        console.warn(result)
        this.searchResult = result;
      })
    }
  }
  hideSearch() {
    this.searchResult = undefined
  }
  redirectToDetails(id: number) {
    this.router.navigate(['/details/+id']);  //redirect to header page i.e index
  }
  submitSearch(val: string) {

    this.router.navigate([`search/${val}`])
  }
  handleSubmit(){
    // this.router.navigate(['/user-auth']);
    this.router.navigateByUrl('/user-auth');

  }
  getAllcart(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore); //here we store data in localstorage n convrt it into JSON format 
     this.http.get<any>('http://localhost:3000/cart?userId=' + userData.id).subscribe((res)=>{
      this.cardData=res;
     })
    // this.http.get('http://localhost:3000/products').subscribe((res)=>{
    //   this.cardData=res;
    //   console.log("cardData", this.cardData);
      
    // })
  }
}