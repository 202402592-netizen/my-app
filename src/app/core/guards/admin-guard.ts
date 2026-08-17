import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastService } from '../services/toast';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (
    authService.isAuthenticated() &&
    authService.isAdmin()
  ) {
    return true;
  }

  toastService.error('Access denied. Admin Required');

  router.navigate(['/products']);

  return false;
};