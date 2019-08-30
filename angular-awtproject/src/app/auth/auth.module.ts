import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AngularMaterialModule } from '../angular-material.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserProductsComponent } from './user-products/user-products.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    UserProductsComponent,
    ProductCreateComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule {}
