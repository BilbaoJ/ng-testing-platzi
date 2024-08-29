import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ HttpClientModule, ProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  products: Product[] = [];

  constructor(
    private productsService: ProductsService
  ){}

  ngOnInit(){
    this.getAllProducts();
  }

  getAllProducts(){
    this.productsService.getAll()
    .subscribe(products => {
      this.products = products;
    });
  }

}
