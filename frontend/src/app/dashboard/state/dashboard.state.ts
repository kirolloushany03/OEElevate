import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { GetBadItemsRate, GetMachinesBrief, GetMachinesWithLowestOee } from './dashboard.actions';
import { DashboardService } from '../service/dashboard.service';
import { tap } from 'rxjs';
import { Machine, MachineSummary } from '../../models/machine';

export interface DashboardStateModel {
  badItemsPercentage: number;
  machinesWithLowestOee: MachineSummary[] | null;
  machinesBrief: Machine[] | null;
}

@State<DashboardStateModel>({
  name: 'dashboard',
  defaults: {
    badItemsPercentage: 0,
    machinesWithLowestOee: null,
    machinesBrief: null
  }
})
@Injectable()
export class DashboardState {

  constructor(private dashboardService: DashboardService) { }

  @Selector()
  static badItemsRate(state: DashboardStateModel) {
    return state.badItemsPercentage;
  }

  @Selector()
  static machinesWithLowestOee(state: DashboardStateModel) {
    return state.machinesWithLowestOee;
  }

  @Selector()
  static machinesBrief(state: DashboardStateModel) {
    return state.machinesBrief;
  }

  @Action(GetBadItemsRate)
  getBadItemsRate(ctx: StateContext<DashboardStateModel>, action: GetBadItemsRate) {
    return this.dashboardService.getBadItemsRate().pipe(
      tap({
        next: (badItemsPercentage: any) => {
          ctx.patchState({ badItemsPercentage });
        }
      })
    )
  }

  @Action(GetMachinesWithLowestOee)
  getMachinesWithLowestOee(ctx: StateContext<DashboardStateModel>, action: GetMachinesWithLowestOee) {
    return this.dashboardService.getMachinesWithLowestOee().pipe(
      tap({
        next: (machinesWithLowestOee: any) => {
          ctx.patchState({ machinesWithLowestOee });
        }
      })
    )
  }

  @Action(GetMachinesBrief)
  getMachinesBrief(ctx: StateContext<DashboardStateModel>, action: GetMachinesBrief) {
    return this.dashboardService.getMachines().pipe(
      tap({
        next: (machinesBrief: any) => {
          ctx.patchState({ machinesBrief });
        }
      })
    )
  }
}
