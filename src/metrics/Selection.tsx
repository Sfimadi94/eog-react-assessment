import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
// prettier-ignore
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
} from '@material-ui/core';
import { actions } from '../store/metricsReducer';
import { RootState } from '../store';

const useStyles = makeStyles(() => ({
  formControl: {
    minwidth: 100,
  },
}));

const metricsQuery = gql`
  query {
    getMetrics
  }
`;

function Selection() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data, error } = useQuery(metricsQuery);
  const { metricsList, selectedMetric } = useSelector((state: RootState) => state.metrics);

  useEffect(() => {
    if (data) {
      const { getMetrics } = data;
      dispatch(actions.getMetrics(getMetrics));
    }

    if (error) {
      console.log(error);
    }
  }, [dispatch, data, error]);

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.selectedMetric(e.target.value));
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Select ...</InputLabel>
      <Select value={selectedMetric} onChange={handleChange}>
        {data.getMetrics.map((metric: any) => (
          <MenuItem value={metric} key={metric}>
            {metric}
          </MenuItem>
        ))}
        {metricsList.map((item: any) => (
          <MenuItem value={item}>{item}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // return (
  //   <Card>
  //     <CardContent>
  //       <div>Hello</div>
  //     </CardContent>
  //   </Card>
  // )
}

export default Selection;
