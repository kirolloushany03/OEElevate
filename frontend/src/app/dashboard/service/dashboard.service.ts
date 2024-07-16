import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private crudService: CrudService) { }

  getBadItemsRate() {
    return this.crudService.read('/bad-units-rate');
  }

  getMachinesWithLowestOee() {
    return this.crudService.read('/machines/lowest_oee');
  }

  getMachines() {
    return this.crudService.read('/machines');
  }
}
