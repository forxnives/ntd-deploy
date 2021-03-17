import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS, Table, TableCaption, TableHead, TableRow, TableCell, Text, Icon, TableBody, DatePicker, DatePickerProps  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import {createObjectsFromParams, priceFormat } from './../../helpers';
import Drawer from '@material-ui/core/Drawer';
import ChequeSupportingDocs from './supportingdocs.cheques';
import SignatureSupportingDocs from './supportingdocs.signature';
import BankRecieptSupportingDocs from './supportingdocs.bankreciept';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';


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



const DisplayDeposit: React.FC<BasePropertyProps> = (props) => {

    const { record } = props;

    
    

    const [ depositInvoices, setDepositInvoices ] = useState([]);
    const [ depositStatus, selectDepositStatus ] = useState(record.params.depositStatus);
    const [ drawerToggle, toggleDrawerToggle ] = useState(false);
    const [value, setValue] = useState(null);
    const [selectedDate, setSelectedDate] = useState(record.params.submissionDate);

 
    const classes = useStyles();

    const ExcelDownloadButton = styled.a`${ButtonCSS};`


    useEffect(() => {

        
        document.querySelector('.admin-bro_H2').innerText = `Deposit`;
        const breadcrumbs = document.querySelectorAll('.breadcrumbs__BreadcrumbLink-yjyesi-0')
        breadcrumbs[2].innerText = 'Edit';

        async function populateInvoices() {

            const invoicesArray =  createObjectsFromParams(record.params, 'invoices')
            const response = await fetch(`${window.location.origin}/invoicecreate`, {

                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    invoices: invoicesArray
                }),
            });
            const data = await response.json();
            setDepositInvoices(data.data)
        }

        async function handleExcelCreate () {


            const response = await fetch(`${window.location.origin}/depositexcel`, {
    
                method: 'PUT',
    
                headers: {
                  'Content-Type': 'application/json',
                },
    
                body: JSON.stringify({
                    depositId: record.id
                }),
            })
        }



        const handleZipDepositDocs = async () => {

            const response = await fetch(`${window.location.origin}/depositdocszip`, {
        
                method: 'PUT',
    
                headers: {
                  'Content-Type': 'application/json',
                },
    
                body: JSON.stringify({
                    depositId: record.id
                }),
            })
        }





        handleExcelCreate ()
        populateInvoices();
        handleZipDepositDocs();
    }, [selectedDate]);


    useEffect(()=>{
        
        

    },[value])





    const handleDateSelect = async (date) => {

        try {

            setSelectedDate(date)

            const response = await fetch(`${window.location.origin}/depositedit/date`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
    
                    depositDate: date,
                    depositId: record.id
                }),
            });

            if (response.status===500) {
                throw new Error('Upload Failure')
            }

        } catch (err) {
            alert(err.message)
        }

    }

    const handleDepositStatusSelect = async (status) =>{

        try {

            selectDepositStatus(status)

            const response = await fetch(`${window.location.origin}/depositedit/depositstatus`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
    
                    depositStatus: status,
                    depositId: record.id
                }),
            })
    
            if (response.status===500) {
                throw new Error('Upload Failure')
            }

        } catch(err){
            alert(err.message)
        }

    }


    const handleDateCheck = () => {
        if (!selectedDate) {
            alert('warning, no submission date')
        }
    }


    const depositInvoicesDisplay = (depositInvoiceObjects, paymentMethod) => {


        if (paymentMethod === 'CHEQUES') {  
            depositInvoiceObjects = depositInvoiceObjects.filter(object=>(

                object.paymentDoc
            ))

        }
   
        if (paymentMethod === 'CASH') {  

            //TURN THIS INTO A REDUCER.  PROBLEM IS PAYEMENT TYPE NOW HAS AN ENUM F TWO OPTIONS.  NEED TO CHEC PAYMENTDOCTYPE NOW

            depositInvoiceObjects = depositInvoiceObjects.filter(object => (


                object.paymentMethod === 'CASH' && !object.paymentDoc && object.status === 'PAID'

            ))
        }


        return depositInvoiceObjects.map(object => (
            <TableRow>
                <TableCell>{object.customerCode}</TableCell>
                {/* <TableCell>{object.customer}</TableCell> */}
                {/* <TableCell>{object.paymentMethod}</TableCell> */}
                <TableCell>{object.number}</TableCell>
                <TableCell>{
                
                
                object.returned ? 
                        
                        (priceFormat(object.price - object.returned.returnAmount)
                        
                        ) : (
                            priceFormat(object.price))
                
                        }
                
                
                </TableCell>
            </TableRow>
        ))
    }


    return (

        <div>

        <Box>

            <Box marginBottom='xxl' >

                <Box flex flexDirection='row'>

                    <Box flex alignItems='center' width='80px'>
                        <h1>Deposit Status</h1>
                    </Box>

                    <Box>

                        <FormControl className={classes.formControl}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={depositStatus}
                                onChange={(e)=> handleDepositStatusSelect(e.target.value)}>

                                <MenuItem value='PENDING'> Pending </MenuItem>
                                <MenuItem value='DEPOSITED'> Deposited </MenuItem>

                            </Select>
                        </FormControl>  

                    </Box>
     
                </Box>


                <Box marginTop='xl'   flex   height="70px" >

                    <Box flex alignItems='center' width='80px'>

                        <h1>Submission Date </h1>
                        
                    </Box>

                    <Box flex alignItems='center'>

                        <DatePicker value={selectedDate} onChange={date => handleDateSelect(date)} />

                    </Box>
                    
                </Box>

            </Box>


            <Box marginTop='50px'>

                <Box>

                <Table>
                    <TableCaption>
                        <Text as="span">{`CHEQUES`}</Text>

                    </TableCaption>
                    <TableHead>
                        <TableRow>

                        <TableCell>
                                                    Customer Code
                            <Icon icon="CaretUp" />
                            
                        </TableCell>

                        <TableCell>Invoice</TableCell>

                        <TableCell>Amount</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>

                        { depositInvoices.length && (depositInvoicesDisplay(depositInvoices, 'CHEQUES')) }

                    </TableBody>

                </Table>

                </Box>

                <Box marginTop='50px'>

                    <Table>
                        <TableCaption>
                            <Text as="span">{`CASH`}</Text>

                        </TableCaption>
                        <TableHead>
                            <TableRow>

                            <TableCell>
                                                        Customer Code
                                <Icon icon="CaretUp" />
                                
                            </TableCell>

                            <TableCell>Invoice</TableCell>

                            <TableCell>Amount</TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody>

                            { depositInvoices.length && (depositInvoicesDisplay(depositInvoices, 'CASH')) }

                        </TableBody>

                    </Table>

                </Box>

            </Box>

    
            <ExcelDownloadButton onClick={() => handleDateCheck()} marginTop='xxl'  href={`${window.location.origin}/depositdocszip/${record.params._id}`} > Download Files </ExcelDownloadButton>

            <Drawer anchor={'bottom'} open={drawerToggle} onClose={() => toggleDrawerToggle(false)}>

                        {
                            value === 0 && (<SignatureSupportingDocs toggleDrawer={toggleDrawerToggle} drillProps={props} />)
                        }
                        {
                            value === 1 && (<BankRecieptSupportingDocs toggleDrawer={toggleDrawerToggle} drillProps={props} />)
                        }
            </Drawer>

        </Box>

        <BottomNavigation
            value={ drawerToggle ? (value) : (null) }
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes.root}
            >
            {/* <BottomNavigationAction onClick={() => toggleDrawerToggle(!drawerToggle)} label="Cheques" icon={<Icon icon='CaretUp' />} /> */}
            <BottomNavigationAction onClick={() => toggleDrawerToggle(!drawerToggle)} label="Signature" icon={<Icon icon='CaretUp' />} />
            <BottomNavigationAction onClick={() => toggleDrawerToggle(!drawerToggle)} label="Bank Reciept" icon={<Icon icon='CaretUp' />} />
        </BottomNavigation>

        </div>
    )
}

export default DisplayDeposit;