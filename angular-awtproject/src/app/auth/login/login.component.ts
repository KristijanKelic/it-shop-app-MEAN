import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  isLoading = false;
  loadingStatus: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadingStatus = this.authService
      .getIsLoadingListener()
      .subscribe(willLoad => (this.isLoading = willLoad));

    this.emailFormGroup = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      })
    });
    this.passwordFormGroup = new FormGroup({
      password: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  loginUser() {
    this.authService.loginUser(
      this.emailFormGroup.get('email').value,
      this.passwordFormGroup.get('password').value
    );
    this.isLoading = true;
  }

  ngOnDestroy() {
    this.loadingStatus.unsubscribe();
  }
}
