import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SignUpGuard } from './sign-up.guard';
import { UserProductsComponent } from './user-products/user-products.component';
import { AuthGuard } from './auth.guard';
import { ProductCreateComponent } from './product-create/product-create.component';
import { CreateProductGuard } from './create-product.guard';
import { CartComponent } from './cart/cart.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent, canDeactivate: [SignUpGuard] },
  {
    path: 'create-product',
    component: ProductCreateComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CreateProductGuard]
  },
  {
    path: 'edit-product/:id',
    component: ProductCreateComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CreateProductGuard]
  },
  {
    path: 'myproducts',
    component: UserProductsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  {
    path: 'myprofile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SignUpGuard, CreateProductGuard, AuthGuard]
})
export class AuthRoutingModule {}
