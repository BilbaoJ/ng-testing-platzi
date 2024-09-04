import { Component } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  product: Product | null = null;
  status: 'loading' | 'success' | 'error' | 'init' = 'init';
  typeCostumer: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params) => {
        const productId = params.get('id');
        if (productId) {
          this.getProductDetail(productId);
        } else {
          this.goToBack();
        }
      });

    this.route.queryParamMap.subscribe(params => {
      this.typeCostumer = params.get('type');
    })
  }

  private getProductDetail(productId: string) {
    this.status = 'loading';
    this.productsService.getOne(productId)
    .subscribe({
      next: (product) => {
        this.status = 'success';
        this.product = product;
      },
      error: () => {
        this.status = 'error';
        this.goToBack();
      }
    })
  }

  goToBack() {
    this.location.back();
  }

}
