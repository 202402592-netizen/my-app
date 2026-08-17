import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth'
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (AuthService) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url
    }
  });

  return false;
};