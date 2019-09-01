import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AngularMaterialModule } from '../angular-material.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserProductsComponent } from './user-products/user-products.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { CartComponent } from './cart/cart.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OrderComponent } from './order/order.component';

import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    UserProductsComponent,
    ProductCreateComponent,
    CartComponent,
    UserProfileComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxStripeModule.forRoot('pk_test_eVsxb9BmRd8K5pbmiI4201uK00ORSCd4yZ')
  ]
})
export class AuthModule {}
