import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { Logout } from '../auth/state/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const store = inject(Store);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    });
  }

  return next(req).pipe(
    tap({
      error: (error) => {
        if (error.status === 401) {
          store.dispatch(new Logout());
          console.log('(UNAUTHORIZED) Logging out due to 401 error');
        }
      }
    })
  );
};
