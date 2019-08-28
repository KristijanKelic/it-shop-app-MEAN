import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  userIsAuthenticated = false;
  private usernameSub: Subscription;
  username: string;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getisAuthenticated();
    this.username = this.authService.getName();
    this.usernameSub = this.authService
      .getUsername()
      .subscribe(result => (this.username = result));
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
    this.usernameSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
