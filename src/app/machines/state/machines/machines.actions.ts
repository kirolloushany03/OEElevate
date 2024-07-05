import { Machine, MachineForm } from "../../../models/machine";
import { OeeRecordForm } from "../../../models/oee-record";

export class AddMachine {
  static readonly type = '[Machines] Add machine';
  constructor(public payload: MachineForm) { }
}

export class GetMachines {
  static readonly type = '[Machines] Get machines';
  constructor() { }
}

export class AddOeeRecord {
  static readonly type = '[Machines] Add OEE record';
  constructor(public machine: Machine, public payload: OeeRecordForm) { }
}
