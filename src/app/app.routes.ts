import { Routes } from '@angular/router';
import { PicPreviewComponent } from './components/pic-preview/pic-preview.component';
import { PeopleComponent } from './components/people/people.component';
import { OthersComponent } from './components/others/others.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'pico-preview',
    component: PicPreviewComponent
  },
  {
    path: 'people',
    component: PeopleComponent
  },
  {
    path: 'others',
    canActivate: [ authGuard ],
    component: OthersComponent
  },
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(m => m.productsRoutes)
  },
];
