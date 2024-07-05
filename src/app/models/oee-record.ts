export interface OeeData {
  run_time: number;
  planned_production_time: number;
  good_units: number;
  total_units: number;
  ideal_cycle_time?: number;
  performance?: number;
  quality?: number;
  availability?: number;
  oee?: number;
}
export interface OeeRecord {
  id: number;
  machine_id?: number;
  run_time: number;
  planned_production_time: number;
  good_units: number;
  total_units: number;
  ideal_cycle_time: number;
  created_at: string;
}
export interface OeeRecordForm extends OeeData {
  date: string;
}
