import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { DxDataGridModule, DxFormComponent, DxFormModule } from 'devextreme-angular';
import { AddMachine, GetMachines } from '../state/machines/machines.actions';
import { Machine, MachineForm, MachineSummary } from '../models/machine';
import { MachinesState } from '../state/machines/machines.state';
import { Observable, skip } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SlidingOverlayComponent } from '../shared/sliding-overlay/sliding-overlay.component';
import { MachineService } from './service/machine.service';
import { EntriesTableComponent } from './components/entries-table/entries-table.component';
import { EntryFormComponent } from './components/entry-form/entry-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    SlidingOverlayComponent,
    DxFormModule,
    EntriesTableComponent,
    EntryFormComponent,
    RouterModule
  ],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.scss'
})
export class MachinesComponent {
  machines$: Observable<MachineSummary[]>;
  @ViewChild('machineFormOverlay') slidingOverlay?: SlidingOverlayComponent;
  @ViewChild('machineFormComponent') machineFormComponent?: DxFormComponent;
  @ViewChild('entryFormComponent') entryFormComponent?: EntryFormComponent;

  machineForm:MachineForm;

  constructor(private store: Store) {
    this.machines$ = this.store.select(MachinesState.machines)
    this.store.dispatch(new GetMachines());
    this.machineForm = {
      machine_name: ''
    }
  }

  openMachineForm() {
    this.slidingOverlay?.slideIn();
  }

  resetForm() {
    this.machineFormComponent?.instance.reset()
  }

  addMachine(event: Event) {
    event.preventDefault();

    const validation = this.machineFormComponent?.instance.validate();

    if (!validation?.isValid) {
      return;
    }

    this.store.dispatch(new AddMachine(this.machineForm)).subscribe({
      next: () => {
        this.slidingOverlay?.slideOut();
        this.resetForm();
      },
      error: (error) => {
      }
    });
  }

  log(data: any) {
    console.log('machine: ', data);
    return data;
  }

  /* ENTRIES */
  openEntryForm(data?: any) {
    this.entryFormComponent?.open(data);
  }
}
