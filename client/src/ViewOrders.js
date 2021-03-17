import React, { useEffect, useState } from 'react';


import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';


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





const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
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



  function Row(props) {
    const { row, history, update, updateValue } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();


    const requestInvoice = async (id) => {


        try {
            const response = await fetch('http://localhost:3000/requestinvoice', {

                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: id
                }),
            })


            const data = await response.json()


            if (response.status===500) {

                throw new Error('Failure to retrieve')

            }else {
                update(!updateValue)
                history.push('/app/submitsuccess')
            }



          
        } catch(err) {

            console.log(err.message)
        }
    }


  
    return (
      <React.Fragment>
        <StyledTableRow className={classes.root}>
          <StyledTableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.number}
          </StyledTableCell>
          <StyledTableCell>{row.date}</StyledTableCell>
          <StyledTableCell>{row.items}</StyledTableCell>
          <StyledTableCell>{row.status}</StyledTableCell>

        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>



                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center" >Quantity</StyledTableCell>
                      <StyledTableCell align="center" >Packing</StyledTableCell>
                      <StyledTableCell align="center" >Item</StyledTableCell>

                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {row.requests.map((requestRow, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center" component="th" scope="row">
                          {requestRow.quantity}
                        </StyledTableCell>
                        <StyledTableCell align="center" >{requestRow.packing}</StyledTableCell>
                        <StyledTableCell align="center" >{requestRow.item}</StyledTableCell>

                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>


                <Box marginTop={2}>

                {
                    row.repliedPrice ?  ( <Box flexDirection="column" >
                    <Typography variant="h6" gutterBottom component="div">
                    Total Price: {row.repliedPrice}
                    </Typography>

                    { row.status === 'REPLIED' && (
                    <Button onClick={() => requestInvoice(row.id)} variant="contained" color="primary">
                        Request Invoice
                    </Button>
                    ) }

                    
                    </Box>
                  ) : (
                    null
                  )
                }


                </Box>


              
              </Box>
            </Collapse>
          </StyledTableCell>
        </StyledTableRow>
      </React.Fragment>
    );
  }
  
  // Row.propTypes = {
  //   row: PropTypes.shape({
  //     calories: PropTypes.number.isRequired,
  //     carbs: PropTypes.number.isRequired,
  //     fat: PropTypes.number.isRequired,
  //     history: PropTypes.arrayOf(
  //       PropTypes.shape({
  //         amount: PropTypes.number.isRequired,
  //         customerId: PropTypes.string.isRequired,
  //         date: PropTypes.string.isRequired,
  //       }),
  //     ).isRequired,
  //     name: PropTypes.string.isRequired,
  //     price: PropTypes.number.isRequired,
  //     protein: PropTypes.number.isRequired,
  //   }).isRequired,
  // };
  


const ViewOrders = ({history, ordersArray, update, updateValue}) => {

    
    


    // const classes = useStyles();

    const rows = ordersArray.map(order => {

        if (order.replyItems.length) {
            return createData(order._id, order.orderNumber, order.date, order.replyItems.length, order.invoiceStatus, order.replyItems, order.replyTotalPrice)

        } else {
            return createData(order._id, order.orderNumber, order.date, order.requests.length, order.invoiceStatus, order.requests, order.replyTotalPrice)
        }

    })


    return (

        <TableContainer component={Paper}>


        {ordersArray.length ? (

        <Table aria-label="collapsible table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell />
            <StyledTableCell>Order Number</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Items</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>

          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row update={update} updateValue={updateValue} history={history} key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>

        ) : (

          <h4 style={{paddingLeft: 20 + 'px'}} > No orders </h4>

        ) }



      </TableContainer>

    )
}

export default withRouter(ViewOrders);