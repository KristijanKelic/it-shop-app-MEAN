import { Component, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/product/product.service';
import { Product } from 'src/app/product/product.model';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css']
})
export class UserProductsComponent implements OnInit, OnDestroy {
  isLoading = false;
  products: Product[] = [];
  private productsSub: Subscription;

  constructor(
    private productService: ProductService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productService.getUserProducts();
    this.productsSub = this.productService
      .getProductUpdateListener()
      .subscribe(result => {
        this.isLoading = false;
        this.products = result;
      });
  }

  onDelete(id: string) {
    const dialog = this.matDialog.open(DialogComponent);
    dialog.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.productService.deleteProduct(id).subscribe(
          result => {
            this.snackBar.open(result.message, '', {
              duration: 2000
            });
            this.productService.getUserProducts();
          },
          error => {
            this.snackBar.open(error.error.message, '', {
              duration: 2000
            });
          }
        );
      }
    });
  }

  onDetails(id: string) {
    this.router.navigate(['/product', id]);
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }
}
