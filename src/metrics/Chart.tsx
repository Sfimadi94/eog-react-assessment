import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, LinearProgress } from '@material-ui/core';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import moment from 'moment';

import { actions } from '../store/metricsReducer';
import { RootState } from '../store';

import {
  GET_MULTIPLE_MEASUREMENTS,
  NEW_MEASUREMENT_SUBSCRIPTION,
} from '../services/queries';

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

const convertTime = (time: any) => {
  const day = moment(time);
  const convert = day.format('h:mm:ss A');

  return convert;
};

// Updates the values with incoming Subscription if it matches
const updateData = (selectedData: any, newMeasurement: any) => {
  let newArray: any[] = [];
  const newSelectedData = [...selectedData];
  for (let i = 0; i < selectedData.length; i += 1) {
    // prettier-ignore
    if (
      selectedData[i].measurements[0].metric
      === newMeasurement.newMeasurement.metric
    ) {
      newArray = [...selectedData[i].measurements];
      newArray.push(newMeasurement.newMeasurement);
      newArray.shift();

      const newDataTest = { ...newSelectedData[i] };
      newDataTest.measurements = newArray;
      newSelectedData[i] = newDataTest;
    }
  }

  return newSelectedData;
};

function Chart() {
  const classes = useStyles();
  const dispatch = useDispatch();
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
        after: currentTime - 30 * 60 * 1000,
      })),
    },
  });

  const newValue = useSubscription(NEW_MEASUREMENT_SUBSCRIPTION);

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        const { getMultipleMeasurements } = await data;
        dispatch(actions.selectMultipleMetricsList(getMultipleMeasurements));
      }
      if (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispatch, data]);

  useEffect(() => {
    const getData = async () => {
      if (selectedMetric.length !== 0) {
        dispatch(actions.getSubscriptions(newValue.data));
        if (
          // prettier-ignore
          subscription.length !== 0
          && selectedMetricsList.length !== 0
        ) {
          // This updates the old value with the new subscription values
          const freshData = updateData(selectedMetricsList, subscription);
          dispatch(actions.selectMultipleMetricsList(freshData));
        }
      }
    };

    getData();
  }, [newValue.data, dispatch]);

  if (!data) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.root}>
      {selectedMetricsList.length > 0 ? (
        // prettier-ignore
        <Plot
          className={classes.chart}
          data={selectedMetricsList.map((item: any) => ({
            x: item.measurements.map((list: { at: number }) => convertTime(list.at)),
            y: item.measurements.map((list: { value: number }) => list.value),
            type: 'scatter',
            mode: 'lines',
            hovertemplate: `
          %{x} <br>
          <b>%{text.metric} (%{text.unit})</b>: %{y}
          `,
            text: item.measurements,
          }))}
          config={{
            displayModeBar: false,
          }}
          layout={{
            margin: { t: 40, b: 50 },
            autosize: true,
            yaxis: {
              title: 'temperature (F)',
              showline: true,
              type: 'linear',
            },
          }}
        />
      ) : null}
    </div>
  );
}

export default Chart;
