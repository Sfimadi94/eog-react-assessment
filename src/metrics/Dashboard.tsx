import React from 'react';
import { Card, makeStyles } from '@material-ui/core';

import Selection from './Selection';
import Chart from './Chart';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(5),
    height: 750,
    display: 'flex',
    flexDirection: 'column',
  },
}));

function Dashboard() {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Selection />
      <Chart />
    </Card>
  );
}

export default Dashboard;
