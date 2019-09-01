import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { passwordMatchValidator } from '../auth/signup/password-match.validator';
import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  hidePw = false;
  hiderPw = false;
  token: string;
  isTokenValid: boolean;
  userEmail: string;
  isLoading = true;
  isLoadingSub: Subscription;

  form: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      rpassword: new FormControl(null, {
        validators: [Validators.required, passwordMatchValidator('password')]
      })
    });

    this.authService
      .getIsLoadingListener()
      .subscribe(is => (this.isLoading = is));
    this.route.paramMap.subscribe(result => {
      this.token = result.get('token');
      this.authService.checkResetPasswordToken(this.token).subscribe(res => {
        this.isTokenValid = res.valid;
        this.userEmail = res.email;
        this.isLoading = false;
      });
    });
  }

  resetPassword() {
    if (this.form.invalid) {
      return;
    }
    this.authService.resetPassword(
      this.form.get('password').value,
      this.userEmail
    );
  }
}
