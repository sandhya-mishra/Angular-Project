import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | product;
  productMessage: undefined | string;
  constructor(private route: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    console.warn(productId);
    productId && this.product.getProduct(productId).subscribe((data:any) => {
      console.warn(data);
      alert(productId)
      this.productData = data;
    })
  }
  submit(data: product) {
    console.warn(data);
    if(this.productData){
      data.id=this.productData.id;
      // data.name=this.ProductData.name;
      // data.category=this.ProductData.category;
      // data.color=this.ProductData.color;
      // data.description=this.ProductData.description;
      // data.image=this.ProductData.image;
      // data.price=this.ProductData.price;
      // data.quantity=this.ProductData.quantity;
    }
    this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        this.productMessage = "Product has been updated";
      }
    });
    setTimeout(() => {
      this.productMessage = undefined
    }, 3000);
  }
}
