import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


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


  constructor(
    private authService: AuthService,
    private matDialog: MatDialog
  ) {}

  /* Subscribing to custom observables from authService to stay updated when cartItems changes
   and when we are fetching carts to display UI indicator */
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

  /* Counting total price for cart items */
  totalPrice() {
    let price = 0;
    for (const item of this.cartItems) {
      price += item.quantity * item.productId.price;
    }
    return price;
  }

  /* Handler for actions on cart items */
  modifyCart(productId: string, modification: string) {
    if (modification === 'add') {
      this.authService.modifyCart(productId, 'add');
    } else if (modification === 'remove') {
      this.authService.modifyCart(productId, 'remove');
    } else {
      const dialog = this.matDialog.open(DialogComponent);
      dialog.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.authService.modifyCart(productId, null);
        }
      });
    }
  }
}
