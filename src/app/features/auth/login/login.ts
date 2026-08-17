import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  returnUrl: string = '/products';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/products']);
      return;
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [ Validators.required, Validators.email ]],
      password: ['',[Validators.required, Validators.minLength(6)] ]
  });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
  }
  get F() {
    return this.loginForm.controls;
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user) {
          this.toastService.success(
           'Welcome back, ${user.name}' 
          );
          if (user.role === 'admin') {
            this.router.navigate([
              '/admin/dashboard'
            ]);}
          else {
            this.router.navigateByUrl(
              this.returnUrl
            );
          }
        } else {
          this.toastService.error(
            'Invalid email or password'
          );
        }
      },
      error: () => {
        this.toastService.error('Login failed, please try again');
        this.loading = false;
      }
    });
  }

  fillAdminCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@store.com',
      password: 'admin123'
    });
  }
  fillUserCredentials(): void {
    this.loginForm.patchValue({
      email: 'user@store.com',
      password: 'user123'
    });
  }
}