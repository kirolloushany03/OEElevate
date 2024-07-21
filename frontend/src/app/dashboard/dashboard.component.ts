import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { DxBarGaugeModule, DxChartModule } from 'devextreme-angular';
import { GetBadItemsRate, GetMachinesBrief, GetMachinesWithLowestOee } from './state/dashboard.actions';
import { DashboardState } from './state/dashboard.state';
import { AsyncPipe, NgFor, NgStyle, PercentPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    PercentPipe,
    NgStyle,
    NgFor,
    DxBarGaugeModule,
    DxChartModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  badItemsRate$ = this.store.select(DashboardState.badItemsRate)
  machinesWithLowestOEE$ = this.store.select(DashboardState.machinesWithLowestOee)

  badItemsRateColor$ = this.badItemsRate$.pipe(
    map(rate => rate < 0.05 ? '--success' : rate < 0.15 ? '--warning' : '--danger')
  );

  machines$ = this.store.select(DashboardState.machinesBrief);

  constructor (private store: Store) {
    this.store.dispatch(new GetBadItemsRate());
    this.store.dispatch(new GetMachinesWithLowestOee());
    this.store.dispatch(new GetMachinesBrief());
  }
}
