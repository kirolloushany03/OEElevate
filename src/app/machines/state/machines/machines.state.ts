import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddMachine, GetMachines } from './machines.actions';
import { Machine, MachineSummary } from '../../../models/machine';
import { tap, timer } from 'rxjs';
import { MachineService } from '../../service/machine.service';

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
        },
        error: (error) => console.error('Error adding machine', error)
      })
    );
  }

  @Action(GetMachines)
  getMachines(ctx: StateContext<MachinesStateModel>, action: GetMachines) {
    return;
  }
}
