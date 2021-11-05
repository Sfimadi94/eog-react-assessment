import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent } from '@material-ui/core';

const useStyles = makeStyles({
  taskBar: {
    backgroundColor: 'white',
  },
});

export default () => {
  const classes = useStyles();
  return (
    <CardContent className={classes.taskBar}>
      {/* <Selection /> */}
    </CardContent>
  );
};
