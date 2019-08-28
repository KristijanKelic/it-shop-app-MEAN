import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SignUpGuard } from './sign-up.guard';
import { UserProductsComponent } from './user-products/user-products.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent, canDeactivate: [SignUpGuard] },
  {
    path: 'myproducts',
    component: UserProductsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SignUpGuard]
})
export class AuthRoutingModule {}
