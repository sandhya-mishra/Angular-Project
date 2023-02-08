import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  [x: string]: any;
  cartData = new EventEmitter<product[] | []>();
  popularProducts() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }
  addProduct(data: product) {
    return this.http.post('http://localhost:3000/products', data);
  }
  productList() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }
  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product: product) {
    console.warn(product);

    return this.http.put<product>(`http://localhost:3000/products/${product.id}`, product);
  }

  trendyProducts() {
    return this.http.get<product[]>("http://localhost:3000/products?_limit=8");
  }
  searchProducts(query: string) {
    return this.http.get<product[]>(`http://localhost:3000/products?q=${query}`);
  }
  localaddToCart(data: product) {
    let cartData = []; //by deflt crt ll be empty
    let localCart = localStorage.getItem('localCart'); //agr cart me phle se kuch add h to show krega
    if (!localCart) { //agr cart me kuch ni hua to
      localStorage.setItem('localCart', JSON.stringify([data])); //localstrge me data hmesha string formt me rkhna h
      this.cartData.emit([data]);
    }
    else {
      cartData = JSON.parse(localCart);
      cartData.push(data)
      localStorage.setItem('localCart', JSON.stringify(cartData)); //here pushing crt data in loclstrge
      this.cartData.emit(cartData);
      
    }
  }
  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items); //to update header after removing items frm cart

    }
  }
  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }
  getCartList(userId: number) {
    return this.http.get<product[]>('http://localhost:3000/cart?userId=' + userId,
      { observe: 'response' }).subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body); //emit update header value
        }

      })
  }

  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }
  currentCart() { //to fetch API data
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore); //here we store data in localstorage n convrt it into JSON format 
    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userData.id);
  }
  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data)
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id,)
  }
  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId, { observe: 'response' }).subscribe((result) => {
      if (result) {
        this.cartData.emit([])
      }
    })
  }
  cancelOrder(orderId: number) {
    return this.http.delete('http://localhost:3000/orders/' + orderId);
  }
}
