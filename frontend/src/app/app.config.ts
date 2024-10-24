import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AuthState } from './auth/state/auth.state';
import { UiState } from './state/ui/ui.state';
import { MachinesState } from './state/machines/machines.state';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { DashboardState } from './dashboard/state/dashboard.state';
import { APP_BASE_HREF } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore([
      AuthState,
      UiState,
      DashboardState,
      MachinesState
    ]),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    {
      provide: APP_BASE_HREF,
      useValue: '/oeelevate/app'
    }
  ]
};
