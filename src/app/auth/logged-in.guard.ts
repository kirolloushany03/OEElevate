import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './state/auth.state';
import { map } from 'rxjs/operators';


export const loggedInGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(AuthState.isLoggedIn).pipe(
    map(loggedIn => {
      if (!loggedIn) {
        console.log('Not logged in, redirecting to login page');
        return router.parseUrl('/auth/login');
      }
      return true;
    })
  );
};

export const loggedOutGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(AuthState.isLoggedIn).pipe(
    map(loggedIn => {
      if (loggedIn) {
        console.log('Already logged in, redirecting to dashboard');
        return router.parseUrl('/dashboard');
      }
      return true;
    })
  );
}
