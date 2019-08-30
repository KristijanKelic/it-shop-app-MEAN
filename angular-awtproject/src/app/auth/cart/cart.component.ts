import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  isLoading = false;
  cartItems = [];
  private isLoadingSub: Subscription;
  private cartItemsSub: Subscription;
  displayedColumns: string[] = ['Product', 'Quantity', 'Price', 'Actions'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoadingSub = this.authService
      .getIsLoadingListener()
      .subscribe(is => (this.isLoading = is));
    this.cartItemsSub = this.authService
      .getCartItemsListener()
      .subscribe(result => {
        this.cartItems = result;
      });
    this.authService.getCart();
  }

  ngOnDestroy(): void {
    this.isLoadingSub.unsubscribe();
    this.cartItemsSub.unsubscribe();
  }

  totalPrice() {
    let price = 0;
    for (const item of this.cartItems) {
      price += item.quantity * item.productId.price;
    }
    return price;
  }

  onRemoveAll(productId: string) {
    this.authService.removeItemsFromCart(productId);
  }
}
