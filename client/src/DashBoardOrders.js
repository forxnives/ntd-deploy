import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(id, number, date, items, status, requests, repliedPrice) {
    return {
        id,
      number,
      date,
      items,
      status,
      requests,
      repliedPrice,

    };
  }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

export default function DenseTable({ordersArray}) {
  const classes = useStyles();


  const rows = ordersArray.map(order => {

    if (order.replyItems.length) {
        return createData(order._id, order.orderNumber, order.date, order.replyItems.length, order.invoiceStatus, order.replyItems, order.replyTotalPrice)

    } else {
        return createData(order._id, order.orderNumber, order.date, order.requests.length, order.invoiceStatus, order.requests, order.replyTotalPrice)
    }

})

  return (

    <div>

    {
        ordersArray.length ? (
            <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Items</TableCell>
                  <TableCell align="right">Status</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.number}
                    </TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.items}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    {/* <TableCell align="right">{row.status}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
            <h2> No Orders </h2>
        )
    }

    </div>



  );
}