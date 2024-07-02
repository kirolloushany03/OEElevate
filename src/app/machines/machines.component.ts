import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { DxDataGridModule, DxFormComponent, DxFormModule } from 'devextreme-angular';
import { AddMachine, GetMachines } from './state/machines/machines.actions';
import { Machine, MachineSummary } from '../models/machine';
import { MachinesState } from './state/machines/machines.state';
import { Observable, skip } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SlidingOverlayComponent } from '../shared/sliding-overlay/sliding-overlay.component';
import { MachineService } from './service/machine.service';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    SlidingOverlayComponent,
    DxFormModule
  ],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.scss'
})
export class MachinesComponent {
  machines$: Observable<MachineSummary[]>;
  @ViewChild('machineFormOverlay') slidingOverlay?: SlidingOverlayComponent;
  @ViewChild('machineForm') machineFormComponent?: DxFormComponent;

  machineForm = {
    name: ''
  }

  constructor(private store: Store) {
    this.machines$ = this.store.select(MachinesState.machines)
    this.store.dispatch(new GetMachines());
  }

  openMachineForm() {
    this.slidingOverlay?.slideIn();
  }

  resetForm() {
    this.machineFormComponent?.instance.reset()
  }

  addMachine(event: Event) {
    event.preventDefault();

    this.store.dispatch(new AddMachine({
      machine_name: this.machineForm.name
    })).subscribe({
      next: () => {
        this.slidingOverlay?.slideOut();
        this.resetForm();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
