import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metricsList: [],
  selectedMetric: [],
  selectedMetricsList: [],
  currentTime: Date.now(),
  loading: false,
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getMetrics: (state, action) => {
      state.metricsList = action.payload;
    },
    selectedMetric: (state, action) => {
      state.selectedMetric = action.payload;
      state.currentTime = Date.now() - 180000;
    },
    selectMultipleMetricsList: (state, action) => {
      state.selectedMetricsList = action.payload;
    },
  },
});

export const { reducer } = slice;
export const { actions } = slice;
