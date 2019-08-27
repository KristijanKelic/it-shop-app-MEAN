import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product;
  isLoading = false;
  userId: string;
  userIsAuth;
  private authSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => {
        this.userId = this.authService.getUserId();
        this.userIsAuth = isAuth;
      });
    this.userId = this.authService.getUserId();
    this.userIsAuth = this.authService.getisAuthenticated();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isLoading = true;
        this.productService.getProduct(paramMap.get('id')).subscribe(
          result => {
            this.isLoading = false;
            this.product = {
              _id: result.product._id,
              title: result.product.title,
              content: result.product.content,
              category: result.product.category,
              price: result.product.price,
              image: result.product.image,
              userId: result.product.creator
            };
          },
          error => {
            this.isLoading = false;
            this.snackBar.open(error.error.message, '', {
              duration: 2000
            });
            this.router.navigate(['/']);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
