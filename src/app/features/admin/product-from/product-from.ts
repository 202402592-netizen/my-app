import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-product-from',
  templateUrl: './product-from.html',
  styleUrl: './product-from.css',
  imports: [NgClass, CommonModule, ReactiveFormsModule]
})
export class ProductFrom implements OnInit {

  productFrom!: FormGroup;
  isEditMode: boolean = false;
  protectId: number | null = null;
  loading: boolean = false;

  categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];

  constructor(
    private formBuider: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initFrom();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.protectId = +id;
      this.loadProduct(this.protectId);
    }
  }

  initFrom(): void {
    this.productFrom = this.formBuider.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required]],
      image: ['', [Validators.required]]
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productFrom.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image
        });
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load product');
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  get F() {
    return this.productFrom.controls;
  }

  onSubmit(): void {
    if (this.productFrom.invalid) {
      Object.keys(this.productFrom.controls).forEach(key => {
        this.productFrom.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const productData = this.productFrom.value;
    if (this.isEditMode && this.protectId) {
      this.productService.updateProducts(this.protectId, productData).subscribe({
        next: () => {
          this.toastService.success('Product updated successfully');
          this.router.navigate(['/admin/dashboard']);
        },
        error: () => {
          this.toastService.error('Failed to update product');
          this.loading = false;
        }
      });
    } else {
      this.productService.addProducts(productData).subscribe({
        next: () => {
          this.toastService.success('Product added successfully');
          this.router.navigate(['/admin/dashboard']);
        },
        error: () => {
          this.toastService.error('Failed to add product');
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}