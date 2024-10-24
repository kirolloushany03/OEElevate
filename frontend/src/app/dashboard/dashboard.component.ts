import { Component, Inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  DxBarGaugeModule,
  DxChartModule,
  DxToastModule,
} from 'devextreme-angular';
import {
  GetBadItemsRate,
  GetMachinesBrief,
  GetMachinesWithLowestOee,
} from './state/dashboard.actions';
import { DashboardState } from './state/dashboard.state';
import {
  APP_BASE_HREF,
  AsyncPipe,
  NgFor,
  NgIf,
  NgStyle,
  PercentPipe,
} from '@angular/common';
import { map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import notify from 'devextreme/ui/notify';
import { AuthState } from '../auth/state/auth.state';

@Component({
  selector: 'oee-dashboard',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    PercentPipe,
    NgStyle,
    DxBarGaugeModule,
    DxChartModule,
    RouterModule,
    DxToastModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(
    private store: Store,
    private authService: AuthService,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {
    this.store.dispatch(new GetBadItemsRate());
    this.store.dispatch(new GetMachinesWithLowestOee());
    this.store.dispatch(new GetMachinesBrief());
  }

  isAdmin$ = this.store.select(AuthState.isAdmin);

  badItemsRate$ = this.store.select(DashboardState.badItemsRate);
  machinesWithLowestOEE$ = this.store.select(
    DashboardState.machinesWithLowestOee
  );

  badItemsRateColor$ = this.badItemsRate$.pipe(
    map((rate) =>
      rate < 0.05 ? '--success' : rate < 0.15 ? '--warning' : '--danger'
    )
  );

  machines$ = this.store.select(DashboardState.machinesBrief);

  getInvitationLink() {
    this.authService.getInvitationToken().subscribe({
      next: (res: unknown) => {
        const token = (res as { invite_token: string }).invite_token;
        const invitationLink = `${window.location.origin}${this.baseHref}/sign-up?token=${token}`;

        navigator.clipboard
          .writeText(invitationLink)
          .then(() => notify('Token successfully copied', 'success', 3000))
          .catch(() => notify('Failed to copy invitation', 'error', 3000));
      },
      error: () => notify('Failed to get invitation', 'error', 3000),
    });
  }
}
