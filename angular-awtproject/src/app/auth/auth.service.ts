import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from './user.model';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoadingListener = new Subject<boolean>();
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private formSubmitted = new Subject<boolean>();
  private username = new Subject<string>();
  private name;
  private token;
  private loginTimer: any;
  private userId: string;
  private cartItemsListener = new Subject<
    [
      {
        productId: any[];
        quantity: number;
      }
    ]
  >();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /* Returning Subject as observable so we can subscribe in other components to get notified
   if property isLoading changes (that means we are doing some actions that need to reach the server
    so user needs to wait.) */
  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  /* Subscribing from other components to know if user is authenticated */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getisAuthenticated() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getName() {
    return this.name;
  }

  getFormSubmitted() {
    return this.formSubmitted.asObservable();
  }

  getUsername() {
    return this.username.asObservable();
  }

  getCartItemsListener() {
    return this.cartItemsListener.asObservable();
  }

  createUser(user) {
    this.http
      .post<{ message: string; user: User }>(
        environment.restAPI + 'user/signup',
        user
      )
      .subscribe(
        result => {
          this.isLoadingListener.next(true);
          this.snackBar.open(result.message, '', {
            duration: 2000
          });
          this.formSubmitted.next(true);
          this.router.navigate(['/auth/login']);
        },
        error => {
          console.log(error);
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
          this.formSubmitted.next(false);
          this.isLoadingListener.next(false);
        }
      );
  }

  loginUser(email: string, password: string) {
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        name: string;
        userId: string;
      }>(environment.restAPI + 'user/login', { email, password })
      .subscribe(
        result => {
          this.token = result.token;
          /* If we have token that means user is logged in */
          if (this.token) {
            const expiresIn = result.expiresIn;
            this.isAuthenticated = true;
            this.userId = result.userId;
            this.name = result.name;
            this.authStatusListener.next(this.isAuthenticated);
            this.username.next(result.name);
            this.setAuthTimer(expiresIn);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.storeAuthData(
              this.token,
              expirationDate,
              this.userId,
              this.name
            );
            this.isLoadingListener.next(true);
            this.snackBar.open(`Welcome back ${result.name}`, '', {
              duration: 2000
            });
            this.router.navigate(['/']);
          }
        },
        error => {
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
          this.isLoadingListener.next(false);
          console.log(error);
        }
      );
  }

  logout() {
    clearTimeout(this.loginTimer);
    this.token = null;
    this.isAuthenticated = false;
    this.username.next(null);
    this.authStatusListener.next(this.isAuthenticated);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/auth/login']);
    this.snackBar.open('Logged out', '', {
      duration: 2000
    });
  }

  /* Storing authentication data in local storage so we can auto auth user upon refresh */
  private storeAuthData(
    token: string,
    exiprationDate: Date,
    userId: string,
    name: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', exiprationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.name = authInformation.name;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(this.isAuthenticated);
      this.username.next(this.name);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      name
    };
  }

  private setAuthTimer(duration) {
    console.log('Setting timer', duration);
    this.loginTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  addToCart(productId: string) {
    this.http
      .post<{ message: string }>(environment.restAPI + 'user/add-to-cart', {
        productId
      })
      .subscribe(
        result => {
          this.snackBar.open(result.message, '', {
            duration: 2000
          });
        },
        error => {
          this.snackBar.open(error.error.message, '', { duration: 2000 });
        }
      );
  }

  getCart() {
    this.isLoadingListener.next(true);
    this.http
      .get<{
        message: string;
        cart: [
          {
            productId: any[];
            quantity: number;
          }
        ];
      }>(environment.restAPI + 'user/cart')
      .subscribe(
        result => {
          this.isLoadingListener.next(false);
          this.cartItemsListener.next(result.cart);
        },
        error => {
          this.isLoadingListener.next(false);
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
        }
      );
  }

  modifyCart(productId: string, modification: string) {
    this.http
      .post<{
        message: string;
      }>(environment.restAPI + 'user/modify-cart', {
        productId,
        modification
      })
      .subscribe(
        result => {
          this.getCart();
          this.snackBar.open(result.message, '', {
            duration: 2000
          });
        },
        error => {
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
        }
      );
  }
}
