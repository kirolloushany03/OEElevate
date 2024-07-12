import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'oee-entries-table',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule
  ],
  templateUrl: './entries-table.component.html',
  styleUrl: './entries-table.component.scss'
})
export class EntriesTableComponent {
  @Input({required: true}) entries: any[] = [];

  constructor() { }
}
