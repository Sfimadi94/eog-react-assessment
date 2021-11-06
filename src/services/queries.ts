import { gql } from '@apollo/client';

export const GET_METRICS = gql`
  query {
    getMetrics
  }
`;

export const GET_MULTIPLE_MEASUREMENTS = gql`
  query ($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      measurements {
        metric
        at
        value
        unit
      }
    }
  }
`;

export const NEW_MEASUREMENT_SUBSCRIPTION = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
