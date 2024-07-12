import { OeeRecord } from "./oee-record";

export interface Machine {
  id: number;
  name: string;
  created_at: string;
}

export interface MachineForm {
  machine_name: string;
}

export interface MachineSummary extends Machine {
  total_good_units: number;
  average_availability: number;
  average_performance: number;
  average_quality: number;
  average_oee: number;

  entries: OeeRecord[];
}
