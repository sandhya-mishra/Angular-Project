import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

totalPrice:number|undefined;
cartData:cart[]|undefined;
orderMsg: string | undefined;
constructor(private product:ProductService, private router:Router){}

ngOnInit(): void {
    this.product.currentCart().subscribe((result)=>{
      let price = 0;//to add all the products price added into cart in cart page
      this.cartData=result; //ll get all d result
      result.forEach((item) => {
        if(item.quantity){
          price = price+ (+item.price* +item.quantity); //cnvrt string value into numeric
        }
  
      });
    this.totalPrice=price+(price/10)+100-(price/10);
    console.warn(this.totalPrice);
    
  }) 
}
orderNow(data:{email:string,address:string,contact:string}){
  console.warn(data);
  let user = localStorage.getItem('user');
  let userId= user && JSON.parse(user).id;

  if(this.totalPrice){
    let orderData:order={
      ...data,
      totalPrice:this.totalPrice,
      userId,
      id:undefined
    }
    this.cartData?.forEach((item)=>{
      setTimeout(() =>{
        item.id && this.product.deleteCartItems(item.id)
      }, 600);
    })

    this.product.orderNow(orderData).subscribe((result)=>{
      if(result){
        // alert('order placed');
        this.orderMsg="YOUR ORDER HAS BEEN PLACED"
        setTimeout(()=>{
          this.router.navigate(['/my-orders']) //redirect to my-orders page
          this.orderMsg=undefined
        }, 700);//aftr 7sec ll redirect to page
      }
    })
  }
}
}
