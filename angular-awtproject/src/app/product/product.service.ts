import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from './product.model';

import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

const BACKEND_URL = environment.restAPI + 'product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  addProduct(product) {
    const productData = new FormData();
    productData.append('title', product.title);
    productData.append('content', product.content);
    productData.append('image', product.image, product.title);
    productData.append('category', product.category);
    productData.append('price', product.price);
    this.http
      .post<{ message: string; product: Product }>(BACKEND_URL, productData)
      .subscribe(
        res => {
          this.snackBar.open('Product created successfully!', '', {
            duration: 2000
          });
          this.router.navigate(['/']);
        },
        error => {
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
        }
      );
  }
}
