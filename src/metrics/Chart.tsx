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

// Updates the values with incoming Subscription if it matches
const updateData = (selectedData: any, newMeasurement: any) => {
  let newArray: any[] = [];
  const newSelectedData = [...selectedData];
  for (let i = 0; i < selectedData.length; i += 1) {
    if (
      selectedData[i].measurements[0].metric.includes(
        newMeasurement.newMeasurement.metric,
      )
    ) {
      newArray = [...selectedData[i].measurements];
      newArray.push(newMeasurement.newMeasurement);
      newArray.shift();

      newSelectedData[i] = newArray;
    }
  }

  return newSelectedData;
};

function Chart() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = React.useState<Measurement[]>([]);
  // const [newData, setNewData] = React.useState<Measurement[]>([])

  // prettier-ignore
  const {
    selectedMetric,
    selectedMetricsList,
    subscription,
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
        setInitialData(data);
      }
    };

    fetchData();
  }, [dispatch, data, error, initialData]);

  useEffect(() => {
    const { loading } = newValue;

    if (
      // prettier-ignore
      Object.keys(subscription).length > 0
      && Object.keys(selectedMetricsList).length > 0
    ) {
      // This updates the old value with the new subscription values

      const freshData = updateData(selectedMetricsList, subscription);
      dispatch(actions.getFreshData(freshData));
      // dispatch(actions.selectMultipleMetricsList(freshData));
      setInitialData(freshData);
      const test = selectedMetricsList.map((item) => item);
    }

    if (!loading) {
      dispatch(actions.getSubscriptions(newValue.data));
    }
  }, [newValue.data]);

  if (!data) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.root}>
      {selectedMetricsList.length > 0 ? (
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
