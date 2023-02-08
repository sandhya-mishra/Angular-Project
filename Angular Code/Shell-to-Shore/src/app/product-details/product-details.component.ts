import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
productData: undefined | product;
productQuantity:number=1
removeCart=false;
cartData: product |undefined;

constructor(private activeRoute:ActivatedRoute, private product:ProductService){ }

ngOnInit(): void {
   let productId=this.activeRoute.snapshot.paramMap.get('productId');
   console.warn(productId);
   productId && this.product.getProduct(productId).subscribe((result)=>{
    console.warn(result);
    this.productData=result;

    //here ll check that in localstorage cartdata is present or not
    let cartData=localStorage.getItem('localcart');
    if(productId && cartData){//ll check wether prodct id is avail or nt
      let items= JSON.parse(cartData);
      //here ll check wether productid exists in cart id or not if avail then ll show new cart optin

     items= items.filter(     // to find the values of keys ...present in array here item is a key
      (item:product)=> 
     productId==item.id.toString())
     if(items.length){ //iitem of current cart ll provide id
    
      this.removeCart=true
     }  else{
      this.removeCart=false
     }
    } 
    let user =localStorage.getItem('user');
    if(user){
      
      let userId =user && JSON.parse(user).id;
      this.product.getCartList(userId); //ll update aftr refreshing
      this.product.cartData.subscribe((result)=>{     //to update data aftr suscribe
      let item = result.filter((item:product)=> productId?.toString()===item.productId?.toString())
    if(item.length){
      this.cartData= item[0]
      this.removeCart=true
    }  
    }) 
    }
   })
   this.addToCart();
}

handleQuantity(val:string){
if(this.productQuantity<50 && val==='plus'){
  this.productQuantity+=1;
}
else if(this.productQuantity>1 && val==='min'){
  this.productQuantity-=1;
}
}
addToCart(){
  if(this.productData){ //here ll check wether product data is avail or nt
    this.productData.quantity= this.productQuantity; //here we r addng total product quantity
    if(!localStorage.getItem('user')){ //here user cn add product without login
      this.product.localaddToCart(this.productData);
      this.removeCart=true; //aftr refrshng remove cart optn ll nt be removed
    }else{
      // console.warn("user is logged in");
      let user= localStorage.getItem('user');
      let userId = user && JSON.parse(user).id
      // console.warn(userId);
      let cartData:cart={
        ...this.productData,
        userId,productId:this.productData.id,
      }
      delete cartData.id;      //ll wrk when product ll be added in DB
      //  
      this.product.addToCart(cartData).subscribe((result)=>{
        if(result){
              this.product.getCartList(userId); //when this fntcn ll cll then cartData ll automate update
              this.removeCart=true;
        }
      })
    }
    
  }
}
removeToCart(productId:number){
  if(!localStorage.getItem('user')){
    this.product.removeItemFromCart(productId)
    
  }else{
    let user= localStorage.getItem('user');
    let userId = user && JSON.parse(user).id
    console.warn(this.cartData);

    this.cartData && this.product.removeToCart(this.cartData.id).subscribe((result)=>{
      if(result){
        this.product.getCartList(userId);
      }
    })
    this.removeCart=false;
  }

}
}
