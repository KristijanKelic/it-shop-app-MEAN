import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { passwordMatchValidator } from './password-match.validator';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  loadingStatus: Subscription;
  hidePw: true;
  hiderPw: true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadingStatus = this.authService
      .getIsLoadingListener()
      .subscribe(willLoad => (this.isLoading = willLoad));

    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      surname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ]),
      rpassword: new FormControl(null, [
        Validators.required,
        passwordMatchValidator('password')
      ])
    });
  }

  createUser() {
    if (this.form.invalid) {
      return;
    }
    const user = {
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      cart: []
    };
    this.isLoading = true;
    this.authService.createUser(user);
  }

  ngOnDestroy() {
    this.loadingStatus.unsubscribe();
  }
}
