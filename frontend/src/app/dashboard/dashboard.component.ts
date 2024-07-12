import { Component } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DxChartModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
