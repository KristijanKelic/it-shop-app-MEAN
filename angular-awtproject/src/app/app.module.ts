import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeCro from '@angular/common/locales/hr';
import localeCroExtra from '@angular/common/locales/extra/hr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { DialogComponent } from './dialog/dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

registerLocaleData(localeCro, 'hr', localeCroExtra);

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    ProductListComponent,
    ProductDetailComponent,
    DialogComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'hr-HR' }
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule {}
