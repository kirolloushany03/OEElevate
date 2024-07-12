import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, of, Subscription, switchMap, tap } from 'rxjs';
import { MachineSummary } from '../../../models/machine';
import { Store } from '@ngxs/store';
import { GetMachineById } from '../../state/machines/machines.actions';
import { CommonModule } from '@angular/common';
import { MachinesState } from '../../state/machines/machines.state';
import { EntryFormComponent } from '../../components/entry-form/entry-form.component';
import { EntriesTableComponent } from '../../components/entries-table/entries-table.component';
import { DxChartModule } from 'devextreme-angular';

@Component({
  selector: 'oee-machine-details',
  standalone: true,
  imports: [
    CommonModule,
    EntryFormComponent,
    EntriesTableComponent,
    DxChartModule
  ],
  templateUrl: './machine-details.component.html',
  styleUrl: './machine-details.component.scss'
})
export class MachineDetailsComponent implements OnDestroy {
  // @ViewChild('entryForm') entryForm?: EntryFormComponent;
  machine$ = this.store.select(MachinesState.machineById).pipe(
    tap({
      next: (machine) => {
        if (!machine?.error)
          this.machineDetails = (machine as MachineSummary);
      }
    })
  );
  entries$ = this.machine$.pipe(
    map(machine => machine?.entries),
    map(entries => entries?.map(entry => ({ ...entry, created_at: new Date(entry.created_at) })))
  )
  machineDetails: MachineSummary | null = null;

  routeSubscription: Subscription;

  constructor(private route: ActivatedRoute, private store: Store) {
    this.routeSubscription = this.routeSubscription = this.route.params.pipe(
      switchMap(params => this.getMachineById(parseInt(params['id'])))
    ).subscribe()
  }

  getMachineById(id?: number | null) {
    if (id)
      return this.store.dispatch(new GetMachineById(id))
    return of(null)
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe()
  }
}
