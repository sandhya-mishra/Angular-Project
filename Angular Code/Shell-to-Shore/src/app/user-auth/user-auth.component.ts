import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs';
import { cart, login, product, SignUp } from '../data-type';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: string = "";
  constructor(private user: UserService, private product: ProductService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // ngOnInit(): void {
  //     this.user.userAuthReload(); // jb tk hm logout ni krenge tb tk ye user-auth page pr redirect ni hone dega ome page pr waps kr dega
  // }
  signUp(data: SignUp) {
    this.user.userSignUp(data)
  }
  login(data: login) {
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result) => {
      console.warn(result);
      if (result) {
        this.authError = "please enter valid user details";
      }
      else {
        this.localCartToRemoteCart()
      }

    })
  }

  openSignUp() {
    this.showLogin = false;
  }
  openLogin() {
    this.showLogin = true;
  }
  localCartToRemoteCart() {

    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) { //here ll check wether the data is null or undefined

      let cartDataList: product[] = JSON.parse(data);

      cartDataList.forEach((product: product, index) => {
        let cartData: cart = {
          ...product, //getting all d information oof product
          productId: product.id,
          userId
        };

        delete cartData.id;         //to del product frm cart
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn("item stored in DB");

            }
          })
          if (cartDataList.length === index + 1) //to empty localstorage
            localStorage.removeItem('localCart');
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart')
        }
      })
    }
    setTimeout(() => {
      this.product.getCartList(userId)
    }, 2000);
  }
}
