import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage: string | undefined;
  constructor(private product: ProductService) { }

  // product=new FormGroup({
  //   name:new FormControl('', Validators.required),
  //   price:new FormControl('', Validators.required),
  //   color:new FormControl('', Validators.required),
  //   category:new FormControl('', Validators.required),
  //   description:new FormControl('', Validators.required),
  //   image:new FormControl('', Validators.required),
  // })
  // get name(){
  //   return this.product.get('name')
  // }
  // get price(){
  //   return this.product.get('name')
  // }
  // get color(){
  //   return this.product.get('name')
  // }
  // get category(){
  //   return this.product.get('name')
  // }
  // get description(){
  //   return this.product.get('name')
  // }
  // get image(){
  //   return this.product.get('name')
  // }
  ngOnInit(): void {

  }
  submit(data: product) {
    this.product.addProduct(data).subscribe((result) => {
      console.warn(result);
      if (result) {
        this.addProductMessage = "Product is successfully added"
      }
      setTimeout(() => this.addProductMessage = undefined, 3000);
    })
  }
}
