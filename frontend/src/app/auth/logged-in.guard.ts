import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './state/auth.state';
import { filter, map, skip, take } from 'rxjs/operators';
import { Logout } from './state/auth.actions';
import { log } from '../utlils/operators';


export const loggedInGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(AuthState.isLoggedIn).pipe(
    filter(loggedIn => loggedIn !== null), // Skip the initial null value
    take(1),
    map(loggedIn => {
      if (!loggedIn) {
        return router.parseUrl('/login');
      }
      return true;
    })
  );
};

export const loggedOutGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(AuthState.isLoggedIn).pipe(
    filter(loggedIn => loggedIn !== null), // Skip the initial null value
    take(1),
    map(loggedIn => {
      if (loggedIn) {
        return router.parseUrl('/dashboard');
      }
      return true;
    })
  );
}
