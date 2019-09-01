import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.model';
import { environment } from '../../environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.restAPI + 'product/';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[];
  private productsUpdated = new Subject<Product[]>();

  private formSubmitted = new Subject<boolean>();
  private isLoadingListener = new Subject<boolean>();

  private isAuth;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => (this.isAuth = isAuth));
  }

  getformSubmitted() {
    return this.formSubmitted.asObservable();
  }

  getisLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  getProducts() {
    this.isAuth = this.authService.getisAuthenticated();
    this.route.queryParamMap.subscribe(qParams => {
      let queryParams = '?';
      if (this.isAuth) {
        queryParams += `userId=${this.authService.getUserId()}`;
      }
      if ((qParams as any).params.category === 'laptops') {
        queryParams += '&category=Laptop';
      }
      if ((qParams as any).params.category === 'smartphones') {
        queryParams += '&category=Smartphone';
      }

      this.productsUpdated.next([]);
      this.isLoadingListener.next(true);
      this.http
        .get<{ message: string; products: any[] }>(BACKEND_URL + queryParams)
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
                  userId: {
                    name: el.creator.name,
                    surname: el.creator.surname,
                    _id: el.creator._id
                  }
                };
              })
            };
          })
        )
        .subscribe(
          result => {
            this.products = result.products;
            this.productsUpdated.next([...this.products]);
            this.isLoadingListener.next(false);
          },
          error => {
            this.snackBar.open(error.error.message, '', {
              duration: 2000
            });
            this.isLoadingListener.next(false);
          }
        );
    });
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
        creator: {
          name: string;
          surname: string;
          _id: string;
        };
      };
    }>(BACKEND_URL + id);
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
          this.router.navigate(['/auth/myproducts']);
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
        BACKEND_URL + product._id,
        productData
      )
      .subscribe(
        result => {
          this.formSubmitted.next(true);
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

  deleteProduct(id: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + id);
  }

  getUserProducts() {
    this.http
      .get<{ message: string; products: Product[] }>(
        BACKEND_URL + 'user/products'
      )
      .subscribe(
        result => {
          this.products = result.products;
          this.productsUpdated.next([...this.products]);
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
