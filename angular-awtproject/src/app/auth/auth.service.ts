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

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
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
          this.router.navigate(['/auth/login']);
        },
        error => {
          this.snackBar.open(error.error.message, '', {
            duration: 2000
          });
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
          this.isLoadingListener.next(true);
          this.snackBar.open(`Welcome back ${result.name}`, '', {
            duration: 2000
          });
          console.log(result);
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
}
