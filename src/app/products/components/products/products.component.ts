import { Component } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/product.model';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from '../product/product.component';
import { ValueService } from '../../../services/value.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ HttpClientModule, ProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  products: Product[] = [];
  limit = 10;
  offset = 0;
  status: 'loading' | 'success' | 'error' | 'init' = 'init';
  rta: string = '';

  constructor(
    private productsService: ProductsService,
    private valueService: ValueService
  ){}

  ngOnInit(){
    this.getAllProducts();
  }

  getAllProducts(){
    this.status = 'loading';
    this.productsService.getAll(this.limit, this.offset)
    .subscribe({
      next: (products)=> {
        this.products = [...this.products, ...products];
        this.offset += this.limit;
        this.status = 'success';
      },
      error: error => {
        // setTimeout(() => {
        //   this.products = [];
        //   this.status = 'error';
        // }, 3000)
      }
    });
  }

  async callPromise(){
    const rta = await this.valueService.getPromiseValue();
    this.rta = rta;
  }

}
