import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, LinearProgress } from '@material-ui/core';
import { useQuery, gql } from '@apollo/react-hooks';
import { actions } from '../store/metricsReducer';
import { RootState } from '../store';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'flex',
  },
  title: {
    fontSize: 14,
  },
  chart: {
    height: '100%',
    width: '100%',
  },
});

const GET_MULTIPLE_QUERIES = gql`
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

function Chart() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { selectedMetric, selectedMetricsList, currentTime } = useSelector(
    (state: RootState) => state.metrics,
  );

  const { data, error } = useQuery(GET_MULTIPLE_QUERIES, {
    variables: {
      input: selectedMetric.map((metric) => ({
        metricName: metric,
        after: currentTime,
      })),
    },
  });

  useEffect(() => {
    if (data) {
      const { getMultipleMeasurements } = data;
      dispatch(actions.selectMultipleMetricsList(getMultipleMeasurements));
      console.log(getMultipleMeasurements);
    }
  }, [dispatch, data, error]);

  if (!data) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.root}>
      <Plot
        className={classes.chart}
        data={selectedMetricsList.map((item: any) => ({
          x: item.measurements.map((list: { at: number }) => list.at),
          y: item.measurements.map((list: { value: number }) => list.value),
          type: 'scatter',
          mode: 'lines',
          hovertemplate: `
            %{x} <br>
            <b>%{text.metric} (%{text.unit})</b>: %{y}
            `,
          text: item.measurements,
        }))}
        layout={{
          margin: { t: 40, b: 50 },
          autosize: true,
          yaxis: {
            title: 'temperature (F)',
            showline: true,
          },
        }}
      />
    </div>
  );
}

export default Chart;
