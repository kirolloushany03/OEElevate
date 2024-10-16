import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddMachine, AddOeeRecord, GetMachineById, GetMachines } from './machines.actions';
import { MachineSummary } from '../../models/machine';
import { tap } from 'rxjs';
import { MachineService } from '../../machines/service/machine.service';
import { HttpStatusCode } from '@angular/common/http';
import { MaybeErorr } from '../../models/request-error';

export interface MachinesStateModel {
  machines: MachineSummary[];
  machineById: MaybeErorr<MachineSummary>;
}

@State<MachinesStateModel>({
  name: 'machines',
  defaults: {
    machines: [],
    machineById: null
  }
})
@Injectable()
export class MachinesState {
  constructor(private machineService: MachineService) { }

  @Selector()
  static machines(state: MachinesStateModel) {
    return state.machines;
  }

  @Selector()
  static machineById(state: MachinesStateModel) {
    return state.machineById
  }

  @Action(AddMachine)
  addMachine(ctx: StateContext<MachinesStateModel>, action: AddMachine) {
    return this.machineService.addMachine(action.payload).pipe(
      tap({
        next: (_) => {
          ctx.dispatch(new GetMachines())
        },
        error: (error) => console.error('Error adding machine', error)
      })
    );
  }

  @Action(GetMachines)
  getMachines(ctx: StateContext<MachinesStateModel>, _action: GetMachines) {
    return this.machineService.getMachinesSummary().pipe(
      tap({
        next: (machines: unknown) => {
          ctx.patchState({ machines: machines as MachineSummary[] });
        },
        error: (error) => console.error('Error getting machines', error)
      })
    );
  }

  @Action(GetMachineById)
  getMachineById(ctx: StateContext<MachinesStateModel>, action: GetMachineById) {
    return this.machineService.getMachineById(action.id).pipe(
      tap({
        next: (machine: unknown) => {
          ctx.patchState({ machineById: machine as MachineSummary });
        },
        error: (error) => {
          if (error.status === HttpStatusCode.NotFound) {
            ctx.patchState({
              machineById: {
                error: {
                  status: error.status,
                  message: error.message?.length
                    ? error.message
                    : `Machine with id ${action.id} not found`
                }
              }
            })
          }
        }
      })
    )
  }

  @Action(AddOeeRecord)
  addOeeRecord(ctx: StateContext<MachinesStateModel>, action: AddOeeRecord) {
    return this.machineService.addOeeRecord(action.machine, action.payload).pipe(
      tap({
        next: (_: unknown) => {
          ctx.dispatch(new GetMachines())
        },
        error: (error) => console.error('Error adding OEE record', error)
      })
    );
  }
}
