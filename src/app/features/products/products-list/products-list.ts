import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  BehaviorSubject,
  combineLatest,
  timeout,
  catchError,
  shareReplay,
  map,
  of
} from 'rxjs';

import { ProductCard }
  from '../../../shared/components/product-card/product-card';

import { ProductService }
  from '../../../core/services/product';

import { ToastService }
  from '../../../core/services/toast';

import { CartService }
  from '../../../core/services/cart';

import { Product }
  from '../../../models/product.model';


@Component({
  selector: 'app-products-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ProductCard
  ],

  templateUrl: './products-list.html',

  styleUrl: './products-list.css'
})
export class ProductsList {

  selectedCategory = '';

  searchTerm = '';

  private filterTrigger$ = new BehaviorSubject<void>(undefined);

  products$: Observable<Product[]>;

  categories$: Observable<string[]>;

  filteredProducts$: Observable<Product[]>;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {

    this.products$ = this.productService
      .getAllProducts()
      .pipe(
        timeout(8000),
        catchError((error) => {
          console.error('Error loading products:', error);
          this.toastService.error(
            'Failed to load products, please try again'
          );
          return of([] as Product[]);
        }),
        shareReplay(1)
      );

    this.categories$ = this.productService
      .getCategories()
      .pipe(
        timeout(8000),
        catchError((error) => {
          console.error('Error loading categories:', error);
          this.toastService.error(
            'Failed to load categories'
          );
          return of([] as string[]);
        }),
        shareReplay(1)
      );

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.filterTrigger$
    ]).pipe(
      map(([products]) => this.applyFilters(products))
    );
  }


  // =========================
  // Category Change
  // =========================

  onCategoryChange(): void {
    this.filterTrigger$.next();
  }


  // =========================
  // Search
  // =========================

  onSearch(): void {
    this.filterTrigger$.next();
  }


  private applyFilters(products: Product[]): Product[] {
    let result = [...products];
    if (this.selectedCategory) {
      result = result.filter(
        product =>
          product.category ===
          this.selectedCategory
      );
    }
    const term =
      this.searchTerm
        .trim()
        .toLowerCase();
    if (term) {
      result = result.filter(
        product => {
          const title =
            product.title?.toLowerCase() || '';
          const description =
            product.description?.toLowerCase() || '';
          const category =
            product.category?.toLowerCase() || '';
          return (
            title.includes(term) ||
            description.includes(term) ||
            category.includes(term)
          );
        }
      );
    }
    return result;
  }

  addToCart(product: Product): void {
    try {
      this.cartService.addToCart(product);
      this.toastService.success(
        'Product added to cart'
      );
    } catch (error) {
      console.error(
        'Error adding product:',
        error
      );
      this.toastService.error(
        'Failed to add product to cart'
      );
    }
  }
}