import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth'
import { CartService } from '../../../core/services/cart';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports:[CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  isMenuOpen: boolean = false;

  currentUser$: Observable<any>;
  cartItemCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.currentUser$ = this.authService.currentUser;

    this.cartItemCount$ = this.cartService.cart.pipe(
      map(cart =>
        cart.items.reduce(
          (count, item) => count + item.quantity,
          0
        )
      )
    );
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isAdmin(user: any): boolean {
    return user?.role === 'admin';
  }
}