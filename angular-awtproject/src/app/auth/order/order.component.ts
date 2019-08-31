import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, Elements, Element as StripeElement } from 'ngx-stripe';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  paymentForm: FormGroup;

  elements: Elements;
  card: StripeElement;
  constructor(
    private stripeService: StripeService,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.stripeService.elements().subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', {
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '18px',
              '::placeholder': {
                color: '#CFD7E0'
              }
            }
          }
        });
        this.card.mount('#card-element');
      }
    });
  }

  buy() {
    const name = this.paymentForm.get('name').value;
    this.stripeService.createToken(this.card, { name }).subscribe(result => {
      if (result.token) {
        console.log(result.token);
        this.authService.postCheckout(result.token);
      } else if (result.error) {
        // Error creating the token
        this.snackBar.open(result.error.message, '', {
          duration: 2000
        });
      }
    });
  }
}
