export interface Metric {
  metric: String;
}

export interface Measurement {
  metric: String;
  at: Number;
  value: Number;
  unit: String;
}

export interface MultipleMeasurements {
  metric: String;
  measurement: Measurement;
}
