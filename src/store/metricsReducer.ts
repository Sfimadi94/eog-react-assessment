import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metricsList: [],
  selectedMetric: [],
  selectedMetricsList: [],
  freshData: [],
  subscription: [],
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
    removeMetric: (state, action) => {
      state.selectedMetricsList = state.selectedMetricsList.filter(
        (metric) => metric !== action.payload,
      );
      state.selectedMetric = state.selectedMetric.filter(
        (metric) => metric !== action.payload,
      );
    },
    getFreshData: (state, action) => {
      state.freshData = action.payload;
    },
    getSubscriptions: (state, action) => {
      state.subscription = action.payload;
      // state.selectedMetricsList.push(action.payload);
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
