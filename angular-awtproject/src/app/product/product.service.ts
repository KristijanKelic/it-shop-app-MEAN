import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.model';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

const BACKEND_URL = environment.restAPI + 'product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[];
  private productsUpdated = new Subject<{
    products: Product[];
    productCount: number;
  }>();

  private formSubmitted = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  getformSubmitted() {
    return this.formSubmitted.asObservable();
  }

  getProducts(productPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${productPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: any[]; productCount: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(el => {
              return {
                _id: el._id,
                title: el.title,
                content: el.content,
                image: el.image,
                category: el.category,
                price: el.price,
                userId: el.creator
              };
            }),
            productCount: productData.productCount
          };
        })
      )
      .subscribe(
        result => {
          this.products = result.products;
          this.productsUpdated.next({
            products: [...this.products],
            productCount: result.productCount
          });
        },
        error => {
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
        }
      );
  }

  getProduct(id: string) {
    return this.http.get<{
      message: string;
      product: {
        _id: string;
        title: string;
        content: string;
        category: string;
        price: number;
        image: string;
        creator: string;
      };
    }>(BACKEND_URL + '/' + id);
  }

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
          this.formSubmitted.next(true);
          this.router.navigate(['/']);
        },
        error => {
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
          this.formSubmitted.next(false);
        }
      );
  }

  updateProduct(product) {
    let productData: Product | FormData;
    if (typeof product.image === 'object') {
      productData = new FormData();
      productData.append('_id', product._id);
      productData.append('title', product.title);
      productData.append('content', product.content);
      productData.append('image', product.image);
      productData.append('category', product.category);
      productData.append('price', product.price);
    } else {
      productData = {
        _id: product.id,
        title: product.title,
        content: product.content,
        image: product.image,
        userId: null,
        category: product.category,
        price: product.price
      };
    }
    this.http
      .put<{ message: string; productId: string }>(
        BACKEND_URL + '/' + product._id,
        productData
      )
      .subscribe(
        result => {
          this.snackBar.open(result.message, '', {
            duration: 2000
          });
          this.router.navigate(['/product/' + result.productId]);
        },
        error => {
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
        }
      );
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }
}
