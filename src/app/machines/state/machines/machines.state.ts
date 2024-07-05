import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddMachine, AddOeeRecord, GetMachines } from './machines.actions';
import { Machine, MachineSummary } from '../../../models/machine';
import { map, tap, timer } from 'rxjs';
import { MachineService } from '../../service/machine.service';
import { log } from '../../../utlils/operators';

export interface MachinesStateModel {
  machines: MachineSummary[];
}

@State<MachinesStateModel>({
  name: 'machines',
  defaults: {
    machines: []
  }
})
@Injectable()
export class MachinesState {
  constructor(private machineService: MachineService) { }

  @Selector()
  static machines(state: MachinesStateModel) {
    return state.machines;
  }

  @Action(AddMachine)
  addMachine(ctx: StateContext<MachinesStateModel>, action: AddMachine) {
    return this.machineService.addMachine(action.payload).pipe(
      tap({
        next: (machine: any) => {
          ctx.dispatch(new GetMachines())
        },
        error: (error) => console.error('Error adding machine', error)
      })
    );
  }

  @Action(GetMachines)
  getMachines(ctx: StateContext<MachinesStateModel>, action: GetMachines) {
    return this.machineService.getMachinesSummary().pipe(
      tap({
        next: (machines: any) => {
          ctx.patchState({ machines });
        },
        error: (error) => console.error('Error getting machines', error)
      })
    );
  }

  @Action(AddOeeRecord)
  addOeeRecord(ctx: StateContext<MachinesStateModel>, action: AddOeeRecord) {
    return this.machineService.addOeeRecord(action.machine, action.payload).pipe(
      tap({
        next: (record: any) => {
          ctx.dispatch(new GetMachines())
        },
        error: (error) => console.error('Error adding OEE record', error)
      })
    );
  }
}
