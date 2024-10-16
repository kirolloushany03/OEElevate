import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './state/auth.state';
import { filter, map, take } from 'rxjs/operators';

export const loggedInGuard: CanActivateFn = (_route, _state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(AuthState.isLoggedIn).pipe(
    filter((loggedIn) => loggedIn !== null), // Skip the initial null value
    take(1),
    map((loggedIn) => {
      if (!loggedIn) {
        return router.parseUrl('/login');
      }
      return true;
    })
  );
};

export const loggedOutGuard: CanActivateFn = (_route, _state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(AuthState.isLoggedIn).pipe(
    filter((loggedIn) => loggedIn !== null), // Skip the initial null value
    take(1),
    map((loggedIn) => {
      if (loggedIn) {
        return router.parseUrl('/dashboard');
      }
      return true;
    })
  );
};
