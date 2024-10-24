import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, of, Subscription, switchMap, tap } from 'rxjs';
import { MachineSummary } from '../../../models/machine';
import { Store } from '@ngxs/store';
import { GetMachineById } from '../../../state/machines/machines.actions';
import { CommonModule } from '@angular/common';
import { MachinesState } from '../../../state/machines/machines.state';
import { EntryFormComponent } from '../../components/entry-form/entry-form.component';
import { EntriesTableComponent } from '../../components/entries-table/entries-table.component';
import { DxChartModule, DxPopupComponent, DxPopupModule } from 'devextreme-angular';
import { MachineService } from '../../service/machine.service';
import * as showdown from 'showdown';

@Component({
  selector: 'oee-machine-details',
  standalone: true,
  imports: [
    CommonModule,
    EntryFormComponent,
    EntriesTableComponent,
    DxChartModule,
    DxPopupModule,
  ],
  templateUrl: './machine-details.component.html',
  styleUrl: './machine-details.component.scss',
})
export class MachineDetailsComponent implements OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private machineService: MachineService
  ) {
    this.routeSubscription = this.routeSubscription = this.route.params
      .pipe(switchMap((params) => this.getMachineById(parseInt(params['id']))))
      .subscribe();
  }

  @ViewChild(DxPopupComponent) popup!: DxPopupComponent;

  loadingAiAdvice = false;
  aiAdvice: string | null = null;
  markdownConverter = new showdown.Converter();

  machine$ = this.store.select(MachinesState.machineById).pipe(
    tap({
      next: (machine) => {
        if (!machine?.error) this.machineDetails = machine as MachineSummary;
      },
    })
  );
  entries$ = this.machine$.pipe(
    map((machine) => machine?.entries),
    map((entries) =>
      entries?.map((entry) => ({
        ...entry,
        created_at: new Date(entry.created_at),
      }))
    )
  );
  machineDetails: MachineSummary | null = null;
  routeSubscription: Subscription;

  getMachineById(id?: number | null) {
    if (id) return this.store.dispatch(new GetMachineById(id));
    return of(null);
  }

  getAiAdvice() {
    if (!this.machineDetails) return;

    this.loadingAiAdvice = true;

    this.machineService.getAiAdvice(this.machineDetails).subscribe({
      next: (advice: unknown) => {
        this.loadingAiAdvice = false;
        this.aiAdvice = this.markdownConverter.makeHtml((advice as { summary: string })['summary']);
        this.popup.instance.show();
      },
      error: (_error) => {

      },
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
