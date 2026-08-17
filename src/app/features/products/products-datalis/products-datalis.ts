import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of, catchError, timeout, map } from 'rxjs';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { ToastService } from '../../../core/services/toast';
import { Product } from '../../../models/product.model';

interface ProductState {
  product?: Product;
  notFound: boolean;
}

@Component({
  selector: 'app-products-datalis',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './products-datalis.html',
  styleUrl: './products-datalis.css'
})
export class ProductsDatalis {

  state$: Observable<ProductState>;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.state$ = of({ product: undefined, notFound: true });
      return;
    }

    this.state$ = this.productService
      .getProductById(id)
      .pipe(
        timeout(8000),
        map((product): ProductState => ({ product, notFound: false })),
        catchError((error) => {
          console.error('Error loading product:', error);
          this.toastService.error(
            'Failed to load product details'
          );
          return of<ProductState>({ product: undefined, notFound: true });
        })
      );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.success(
      'Product added to cart'
    );
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}