import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  isLoading = false;

  constructor() {}

  ngOnInit() {
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
}
