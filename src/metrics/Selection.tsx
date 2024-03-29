import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
  Input,
  LinearProgress,
  Chip,
} from '@material-ui/core';
import { actions } from '../store/metricsReducer';
import { RootState } from '../store';

import { GET_METRICS } from '../services/queries';
// import { Metric } from '../services/interfaces';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 250,
    position: 'relative',
    float: 'right',
    backgroundColor: 'white',
    marginBottom: 30,
  },
  inputLabel: {
    textAlign: 'center',
  },
  chips: {
    backGroundColor: 'white',
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 1,
  },
}));

function Selection() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data, error } = useQuery(GET_METRICS);
  const { metricsList, selectedMetric } = useSelector(
    (state: RootState) => state.metrics,
  );

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

  const handleDelete = (value: string) => {
    dispatch(actions.removeMetric(value));
  };

  if (!data) {
    return <LinearProgress />;
  }

  return (
    <FormControl className={classes.formControl}>
      <InputLabel className={classes.inputLabel}>Select ...</InputLabel>
      <Select
        multiple
        value={selectedMetric}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {(selected as string[]).map((value) => (
              <Chip
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
                key={value}
                label={value}
                className={classes.chip}
                onDelete={() => handleDelete(value)}
              />
            ))}
          </div>
        )}
      >
        {metricsList.map((item: any) => (
          <MenuItem value={item} key={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Selection;
