import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { CardContent, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles({
  taskBar: {
    backgroundColor: 'silver',
  },
  grow: {
    flexGrow: 1,
    backgroundColor: 'silver',
  },
});

export default () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          Select a metric
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
