import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {}

  /* Intercepts every http request to set headers on it */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    const authReq = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' + token)
    });
    return next.handle(authReq);
  }
}
