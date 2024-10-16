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
  getBadItemsRate(ctx: StateContext<DashboardStateModel>, _action: GetBadItemsRate) {
    return this.dashboardService.getBadItemsRate().pipe(
      tap({
        next: (badItemsPercentage: unknown) => {
          ctx.patchState({ badItemsPercentage: badItemsPercentage as number });
        }
      })
    )
  }

  @Action(GetMachinesWithLowestOee)
  getMachinesWithLowestOee(ctx: StateContext<DashboardStateModel>, _action: GetMachinesWithLowestOee) {
    return this.dashboardService.getMachinesWithLowestOee().pipe(
      tap({
        next: (machinesWithLowestOee: unknown) => {
          ctx.patchState({ machinesWithLowestOee: machinesWithLowestOee as MachineSummary[] });
        }
      })
    )
  }

  @Action(GetMachinesBrief)
  getMachinesBrief(ctx: StateContext<DashboardStateModel>, _action: GetMachinesBrief) {
    return this.dashboardService.getMachines().pipe(
      tap({
        next: (machinesBrief: unknown) => {
          ctx.patchState({ machinesBrief: machinesBrief as Machine[] });
        }
      })
    )
  }
}
