import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductCreateComponent } from './product/product-create/product-create.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateProductGuard } from './product/create-product.guard';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  {
    path: 'create-product',
    component: ProductCreateComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CreateProductGuard]
  },
  { path: 'edit-product/:id', component: ProductCreateComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, CreateProductGuard]
})
export class AppRoutingModule {}
