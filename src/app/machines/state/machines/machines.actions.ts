import { Machine, MachineForm } from "../../../models/machine";

export class AddMachine {
  static readonly type = '[Machines] Add machine';
  constructor(public payload: MachineForm) { }
}

export class GetMachines {
  static readonly type = '[Machines] Get machines';
  constructor() { }
}
