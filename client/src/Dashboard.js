import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { priceFormat } from './helpers';

import DashCell from './DashCell';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Deposits from './Deposits';
import Orders from './Orders';

import DashBoardOrders from './DashBoardOrders';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link as LinkRoute,
  withRouter 
} from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import Title from './Title';



const useStyles = makeStyles((theme) => ({

    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
      },

  }));



export default function Dashboard({ordersArray, invoicesArray, userName}) {

    const classes = useStyles();

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);


    const outstandingBalance = invoicesArray.reduce((accumulator, invoice) => {
      if (invoice.status === 'UNPAID'){
        return accumulator + invoice.price
      }else{
        return accumulator
      }
    },0)

    





  return (

    <Container maxWidth="lg" className={classes.container}>
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={fixedHeightPaper}>
          <DashCell name={userName} />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={3} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Deposits outstandingBalance={priceFormat(outstandingBalance)}  />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12} md={9} lg={9}>
        <Paper style={{height: 100 + '%'}} className={classes.paper}>


        <Title>Orders</Title>
      <Typography component="p" variant="h4">

      </Typography>


          {/* <ViewOrders  ordersArray={ordersArray} /> */}

          <DashBoardOrders ordersArray={ordersArray} />

            <Typography color="textSecondary" style={{height: 100 + '%'}}>

            </Typography>

          <div style={{marginTop: 10 + 'px'}} >
        <LinkRoute color="primary" to="/app/neworder" >
          Make new order
        </LinkRoute>
      </div>
        </Paper>
      </Grid>
    </Grid>

  </Container>

  );
}