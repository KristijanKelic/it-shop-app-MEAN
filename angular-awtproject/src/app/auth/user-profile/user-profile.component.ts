import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from '../order.model';

@Component({
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User;
  isLoading = false;
  orders: Order[] = [];
  editUserInfo = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getUserInfo().subscribe(
      result => {
        this.isLoading = false;
        this.user = result.user;
      },
      error => {
        this.isLoading = false;
        this.snackBar.open(error.error.message, '', {
          duration: 2000
        });
      }
    );

    this.authService.getOrders().subscribe(
      result => {
        result.orders.forEach(el => {
          this.orders.push({
            user: el.user,
            createdAt: new Date(el.createdAt),
            products: el.products,
            _id: el._id
          });
        });
      },
      error => {
        this.snackBar.open(error.error.message, '', {
          duration: 2000
        });
      }
    );
  }

  onEdit() {
    this.editUserInfo = true;
  }

  onCancel(newUsername, newSurname) {
    newUsername.value = this.user.name;
    newSurname.value = this.user.surname;
    this.editUserInfo = false;
  }

  onSave(newUsername: string, newSurname: string) {
    if (newUsername.length < 4 || newSurname.length < 4) {
      this.snackBar.open(
        'Username or Surname too shrot (min 4 characters)',
        '',
        { duration: 2000 }
      );
      return;
    }
    if (newUsername === this.user.name && newSurname === this.user.surname) {
      this.snackBar.open('There is no new information', '', { duration: 2000 });
      this.editUserInfo = false;
      return;
    }
    this.editUserInfo = false;
    this.authService.updateUser(newUsername, newSurname);
  }
}
