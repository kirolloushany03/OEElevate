import { Component } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [
    DxDataGridModule
  ],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.scss'
})
export class MachinesComponent {
  machines = [
    { id: 1, name: 'Machine 1', good_units: 200, oee_change: 0.3, average_oee: 0.8 },
  ]
}
