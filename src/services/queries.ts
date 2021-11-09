import { gql } from '@apollo/client';

const currentTime = new Date().valueOf();

export const GET_METRICS = gql`
  query {
    getMetrics
  }
`;

// export const GET_MULTIPLE_MEASUREMENTS = gql`
//   query ($input: [MeasurementQuery]) {
//     getMultipleMeasurements(input: $input) {
//       measurements {
//         metric
//         at
//         value
//         unit
//       }
//     }
//   }
// `;

// prettier-ignore
export const GET_MULTIPLE_MEASUREMENTS = gql`query($input: [MeasurementQuery] = [
{metricName: "tubingPressure", after: ${
  currentTime - 1800000
}, before: ${currentTime}},
{metricName: "casingPressure", after: ${
  currentTime - 1800000
}, before: ${currentTime}},
{metricName: "oilTemp", after: ${
  currentTime - 1800000
}, before: ${currentTime}},
{metricName: "flareTemp", after: ${
  currentTime - 1800000
}, before: ${currentTime}},
{metricName: "waterTemp", after: ${
  currentTime - 1800000
}, before: ${currentTime}},
{metricName: "injValveOpen", after: ${
  currentTime - 1800000
}, before: ${currentTime}}
]
){
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
     at
     value
     metric
     unit
    }
  }
}`;

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
