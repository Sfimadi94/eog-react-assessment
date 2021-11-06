import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, LinearProgress } from '@material-ui/core';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { actions } from '../store/metricsReducer';
import { RootState } from '../store';

import {
  GET_MULTIPLE_MEASUREMENTS,
  NEW_MEASUREMENT_SUBSCRIPTION,
} from '../services/queries';

import { Measurement } from '../services/interfaces';

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

function Chart() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = React.useState<Measurement[]>([]);

  // prettier-ignore
  const {
    selectedMetric,
    selectedMetricsList,
    // subscription,
    currentTime,
  } = useSelector((state: RootState) => state.metrics);

  const { data, error } = useQuery(GET_MULTIPLE_MEASUREMENTS, {
    variables: {
      input: selectedMetric.map((metric) => ({
        metricName: metric,
        after: currentTime,
      })),
    },
  });

  const newValue = useSubscription(NEW_MEASUREMENT_SUBSCRIPTION);

  useEffect(() => {
    const fetchData = () => {
      if (data) {
        const { getMultipleMeasurements } = data;
        dispatch(actions.selectMultipleMetricsList(getMultipleMeasurements));
        setInitialData((newData) => [...newData]);
        console.log('updating');
      }
    };

    fetchData();

    // console.log(selectedMetricsList);
  }, [dispatch, data, error, initialData]);

  useEffect(() => {
    const { loading } = newValue;

    if (!loading) {
      dispatch(actions.getSubscriptions(newValue.data));
    }
  }, [newValue.data]);

  if (!data) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.root}>
      {selectedMetric.length !== 0 ? (
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
      ) : null}
    </div>
  );
}

export default Chart;
