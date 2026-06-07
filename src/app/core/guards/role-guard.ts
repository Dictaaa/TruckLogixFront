import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(roles: number[]): CanActivateFn {
  return () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (!auth.hasRole(roles)) {
      router.navigate(['/transport-movements']); // redirige al home
      return false;
    }

    return true;
  };
}