import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { PicPreviewComponent } from './components/pic-preview/pic-preview.component';

export const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'pico-preview',
    component: PicPreviewComponent
  }
];
