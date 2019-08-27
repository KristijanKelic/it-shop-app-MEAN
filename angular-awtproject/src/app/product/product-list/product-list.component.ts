import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductService } from '../product.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from '../product.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private productsSub: Subscription;
  private authSub: Subscription;
  userIsAuth = false;
  isLoading = false;
  totalProducts;
  productPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 4, 6, 8];
  userId: string;
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productService.getProducts(this.productPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.productsSub = this.productService
      .getProductUpdateListener()
      .subscribe(productData => {
        this.isLoading = false;
        this.products = productData.products;
        this.totalProducts = productData.productCount;
      });
    this.userIsAuth = this.authService.getisAuthenticated();
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => {
        this.userIsAuth = isAuth;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productPerPage = pageData.pageSize;
    this.productService.getProducts(this.productPerPage, this.currentPage);
  }
}
