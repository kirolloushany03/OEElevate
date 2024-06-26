import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AuthState } from './auth/state/auth.state';
import { UiState } from './state/ui/ui.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore([AuthState, UiState])
  ]
};
