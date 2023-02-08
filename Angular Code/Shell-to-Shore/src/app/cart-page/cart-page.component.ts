import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, priceSummary } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})

export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  constructor(private product: ProductService, private router: Router) { } //create instance of product
  ngOnInit(): void {
    this.loadDetails()
  }
  removeToCart(cartId: number | undefined) {

    cartId && this.cartData && this.product.removeToCart(cartId).subscribe((result) => {
      this.loadDetails(); //when items ll be removed then this fnctn loaddetails ll be cll n all d details ll be updated
    })
  }


  loadDetails() {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      let price = 0;//to add all the products price added into cart in cart page
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity); //cnvrt string value into numeric
        }

      });
      this.priceSummary.price = price;
      this.priceSummary.discount = price / 10;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 100;
      this.priceSummary.total = price + (price / 10) + 100 - (price / 10);
      console.warn(this.priceSummary);
      if (!this.cartData.length) {
        this.router.navigate(['/']) // if there ll be no items sotred in crt then we cnt able to go on cart page it ll redirect to home page
      }

    })
  }
  checkout() {
    this.router.navigate(['/checkout'])
  }
}
