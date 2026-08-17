import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast';
import { Product } from '../../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Observable,
  BehaviorSubject,
  combineLatest,
  map,
  catchError,
  shareReplay,
  of
} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  searchTerm = '';

  private searchTrigger$ = new BehaviorSubject<void>(undefined);

  products$: Observable<Product[]>;

  filteredProducts$: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private toastservice: ToastService,
    private router: Router
  ) {

    this.products$ = this.productService.getAllProducts().pipe(
      catchError(() => {
        this.toastservice.error('Failed to load products');
        return of([] as Product[]);
      }),
      shareReplay(1)
    );

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchTrigger$
    ]).pipe(
      map(([products]) => this.applyFilter(products))
    );
  }

  onSearch(): void {
    this.searchTrigger$.next();
  }

  private applyFilter(products: Product[]): Product[] {
    if (!this.searchTerm) {
      return products;
    }
    const term = this.searchTerm.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  addNewProduct(): void {
    this.router.navigate(['/admin/product/add']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/admin/product/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('are you sure you want to delete this Product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastservice.success('product deleted successfully');
          this.products$ = this.productService.getAllProducts().pipe(
            catchError(() => {
              this.toastservice.error('Failed to load products');
              return of([] as Product[]);
            }),
            shareReplay(1)
          );
          this.filteredProducts$ = combineLatest([
            this.products$,
            this.searchTrigger$
          ]).pipe(
            map(([products]) => this.applyFilter(products))
          );
        },
        error: () => {
          this.toastservice.error('Failed to delete product');
        }
      });
    }
  }

  getCategoriesCount(products: Product[]): number {
    const categories = new Set(products.map(p => p.category));
    return categories.size;
  }

  getAveragePrice(products: Product[]): number {
    if (products.length === 0) return 0;
    const total = products.reduce((sum, p) => sum + p.price, 0);
    return total / products.length;
  }
}