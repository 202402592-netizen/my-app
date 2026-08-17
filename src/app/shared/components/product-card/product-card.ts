import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { RouterModule } from '@angular/router';

import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './product-card.html',

  styleUrl: './product-card.css'
})
export class ProductCard {

  @Input()
  product!: Product;

  @Input()
  showActions = true;

  @Output()
  addToCart =
    new EventEmitter<Product>();


  onAddToCart(): void {

    this.addToCart.emit(
      this.product
    );

  }

}