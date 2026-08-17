import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product.model';
import { Cart, CartItem } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0
  });

  cart = this.cartSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart) as CartItem[];
        this.cartSubject.next({
          items: this.items,
          total: this.getTotal()
        });
      } catch (error) {
        console.error('Error loading cart:', error);
        this.items = [];
        this.cartSubject.next({
          items: [],
          total: 0
        });
      }
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(product: Product): void {
    const existingItem = this.items.find(
      item => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({
        product: product,
        quantity: 1
      });
    }
    this.saveCart();
    this.updateCart();
  }

  removeFromCart(productId: number): void {
    this.items = this.items.filter(
      item => item.product.id !== productId
    );
    this.saveCart();
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find(
      item => item.product.id === productId
    );
    if (!item) {
      return;
    }
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    item.quantity = quantity;
    this.saveCart();
    this.updateCart();
  }

  clearCart(): void {
    this.items = [];
    this.saveCart();
    this.updateCart();
  }

  getItemCount(): number {
    return this.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getTotal(): number {
    return this.items.reduce(
      (total, item) =>
        total + (item.product.price * item.quantity),
      0
    );
  }

  private saveCart(): void {
    localStorage.setItem(
      'cart',
      JSON.stringify(this.items)
    );
  }

  private updateCart(): void {
    this.cartSubject.next({
      items: [...this.items],
      total: this.getTotal()
    });
  }
}