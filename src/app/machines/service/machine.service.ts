import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud/crud.service';
import { Machine, MachineForm } from '../../models/machine';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private crud: CrudService) { }

  addMachine(machine: MachineForm) {
    return this.crud.create('/machines', machine);
  }

  getMachines() {
    return this.crud.read('/machines');
  }

  getMachinesSummary() {
    return this.crud.read('/machines/summary');
  }
}
