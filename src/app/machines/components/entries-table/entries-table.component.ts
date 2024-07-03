import { Component, Input } from '@angular/core';

@Component({
  selector: 'oee-entries-table',
  standalone: true,
  imports: [],
  templateUrl: './entries-table.component.html',
  styleUrl: './entries-table.component.scss'
})
export class EntriesTableComponent {
  @Input({required: true}) entries: any[] = [];
}
