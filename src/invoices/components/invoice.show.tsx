import React, { useState, useEffect } from 'react';
import InvoiceCancelReturnDrawer from './invoice-drawer.cancelreturn';
import styled from 'styled-components';
import { Box, Button, ButtonCSS, Icon, Table, TableBody, TableCaption, TableHead, TableRow, TableCell, Text  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Drawer, Chip } from '@material-ui/core';

import PaymentDetailsDrawer from './invoice-drawer.payment.details';

import {createObjectsFromParams, priceFormat  } from './../../helpers';



const useStyles = makeStyles((theme) => ({
    formControl: {
    //   margin: theme.spacing(1),
      minWidth: 100,
    },

    root: {
        // position: 'fixed',
        width: '100vw',
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 8,
        color: 'green'

      },

    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));


const InvoiceShow: React.FC<BasePropertyProps> = (props) => {

    const [ drawerToggle, toggleDrawerToggle ] = useState(false);
    const [ footerValue, setFooterValue ] = useState(null);
    const classes = useStyles();
    const { record } = props;


    useEffect(() => {
        // Update the document title using the browser API
        document.querySelector('.admin-bro_H2').innerText = `Invoice ${record.params.number} (${record.params.paymentMethod})`;
        const breadcrumbs = document.querySelectorAll('.breadcrumbs__BreadcrumbLink-yjyesi-0')
        breadcrumbs[2].innerText = `${props.record.params.number}`;


    }, []);


    const tableRows = (requestObjects) => {

        return requestObjects.map(object => (
            <TableRow>
            <TableCell>{`${object.quantity}`}</TableCell>
            <TableCell>{`${object.packing}`}</TableCell>
            <TableCell>{`${object.item}`}</TableCell>


            </TableRow>
        ))
    }

    const handleDepositRemove = async () => {

        const response = await fetch('http://localhost:3000/depositremove/', {

            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                invoiceId: record.params._id,
                depositId: record.params.depositId
            }),
        })

        if (response.status===500) {
            throw new Error('Upload Failure')
        }

        alert('Successfuly removed from deposit')
        window.location.reload()



    }




    const orderObjects = createObjectsFromParams(record.params, 'orderItems');
    

    return (

        <div>

            <h1> Status: {record.params.docStatus === 'NORMAL' ? (record.params.status) : (record.params.docStatus)} </h1>

            { record.params.depositId ? (

            <Box flex flexDirection='row' marginTop='lg' alignItems='center'> <h1>Deposit:    </h1> <div>&nbsp; &nbsp; </div>  <Chip label={record.params.depositId} onDelete={() => handleDepositRemove()} />
            </Box>
            
            ): (
                
            null) }


            <Box marginTop='60px'>

                {/* <h1>INVERCES</h1> */}

                <Box marginTop='xxl' marginBottom='xxl'>
                    <Table>

                        <TableCaption>
                        <Text as="span">Details</Text>

                        </TableCaption>


                        <TableHead>
                            <TableRow>
                            <TableCell>
                                Code
                                {/* <Icon icon="CaretUp" /> */}
                            </TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                        <TableRow>
                            <TableCell>{record.params.customerCode}</TableCell>
                            <TableCell>{record.params.customer}</TableCell>
                            <TableCell>{

                                record.params['returned.returnAmount'] ? 
                        
                            (priceFormat(record.params.price - record.params['returned.returnAmount'])
                            
                            ) : (
                                priceFormat(record.params.price))
                            
                            }
                            
                            </TableCell>
                        </TableRow>
                        </TableBody>

                    </Table>
                </Box>

                <Box marginTop='50px'>
            {/* <h1>REQUASTS</h1> */}

            <Table>
                <TableCaption>
                    <Text as="span">Items</Text>

                </TableCaption>
                <TableHead>
                    <TableRow>

                    <TableCell>
                                                Quantity
                        {/* <Icon icon="CaretUp" /> */}
                        
                    </TableCell>
                    <TableCell>
                                                Packing
                        {/* <Icon icon="CaretDown" /> */}
                        
                    </TableCell>
                    <TableCell>Description</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>

                    {tableRows(orderObjects)}


                </TableBody>
            </Table>


        </Box>


                <Drawer anchor={'bottom'} open={drawerToggle} onClose={() => toggleDrawerToggle(false)}>

                {
                    footerValue === 0 && (<InvoiceCancelReturnDrawer toggleDrawer={toggleDrawerToggle} drillProps={props}/>)
                }

                {
                    footerValue === 1 && (<PaymentDetailsDrawer toggleDrawer={toggleDrawerToggle} drillProps={props}/>)
                }


                </Drawer>
            </Box>


                <BottomNavigation
                    value={ drawerToggle ? (footerValue) : (null) }
                    onChange={(event, newValue) => {
                        setFooterValue(newValue);
                    }}
                    showLabels
                    className={classes.root}
                    >
                    <BottomNavigationAction onClick={() => toggleDrawerToggle(!drawerToggle)} label="Return/Cancel" icon={<Icon icon='CaretUp' />} />
                    <BottomNavigationAction onClick={() => toggleDrawerToggle(!drawerToggle)} label="Payment Details" icon={<Icon icon='CaretUp' />} />
                    {/* <BottomNavigationAction onClick={() => toggleDrawerToggle(!drawerToggle)} label="" icon={<Icon icon='CaretUp' />} /> */}
                </BottomNavigation>

        </div>
    )
}

export default InvoiceShow;