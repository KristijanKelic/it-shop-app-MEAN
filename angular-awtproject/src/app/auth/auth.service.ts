import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from '../user/user.model';
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

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
    this.router.navigate(['/']);
    this.snackBar.open('Logged out', '', {
      duration: 2000
    });
  }

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
}
