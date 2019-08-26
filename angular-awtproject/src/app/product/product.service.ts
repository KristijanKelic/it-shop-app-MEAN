import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from './product.model';

import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

const BACKEND_URL = environment.restAPI + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  addPost(post) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    postData.append('category', post.category);
    postData.append('price', post.price);
    this.http
      .post<{ message: string; post: Product }>(BACKEND_URL, postData)
      .subscribe(
        res => {
          this.snackBar.open('Post created successfully!', '', {
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
