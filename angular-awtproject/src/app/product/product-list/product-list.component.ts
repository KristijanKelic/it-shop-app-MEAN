import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductService } from '../product.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from '../product.model';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[];
  private productsSub: Subscription;
  private authSub: Subscription;
  private isLoadingSub: Subscription;
  userIsAuth = false;
  isLoading = false;
  userId: string;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productService.getProducts();
    this.userId = this.authService.getUserId();
    this.productsSub = this.productService
      .getProductUpdateListener()
      .subscribe(products => {
        this.isLoading = false;
        this.products = products;
        this.filteredProducts = products;
      });
    this.userIsAuth = this.authService.getisAuthenticated();
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => {
        this.userIsAuth = isAuth;
        this.userId = this.authService.getUserId();
      });
    this.isLoadingSub = this.productService
      .getisLoadingListener()
      .subscribe(is => (this.isLoading = is));
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
  }

  onFilterApply(value: string) {
    this.filteredProducts = this.products.filter(el => {
      return (
        el.title.toLowerCase().includes(value.trim().toLowerCase()) ||
        el.content
          .toLocaleLowerCase()
          .includes(value.trim().toLocaleLowerCase())
      );
    });
  }
}
