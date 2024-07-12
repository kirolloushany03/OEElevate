import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud/crud.service';
import { Machine, MachineForm } from '../../models/machine';
import { OeeRecordForm } from '../../models/oee-record';

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

  addOeeRecord(machine: Machine, data: OeeRecordForm) {
    console.log('machine', machine, 'data', data)
    return this.crud.create(`/machine/${machine.id}/oeeRecords`, data);
  }
}
