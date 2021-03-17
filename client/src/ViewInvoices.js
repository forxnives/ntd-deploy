import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { priceFormat } from './helpers';





const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);




const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(number, total, status, id) {
  return { number, total, status, id };
}



export default function ViewInvoices({invoicesArray}) {

  const classes = useStyles();
  const rows = invoicesArray.map(invoice => {

    return createData(invoice.number, priceFormat(invoice.price), invoice.status, invoice._id )


  })

  return (
    <TableContainer component={Paper}>

      {

        invoicesArray.length ? (
          <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Invoice Number</StyledTableCell>
              <StyledTableCell>Total</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
  
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.number}
                </StyledTableCell>
                <StyledTableCell>{row.total}</StyledTableCell>
                <StyledTableCell>{row.status}</StyledTableCell>
  
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
          <h4 style={{paddingLeft: 20 + 'px'}}> No invoices </h4>
        )

      }

    </TableContainer>
  );
}