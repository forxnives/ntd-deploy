import React, { useEffect, useState } from 'react';
import { Box, Input, Icon, Label } from '@admin-bro/design-system';
import { FormControl, TableHead, TableRow, TableCell, TableBody, Table, MenuItem, Select} from '@material-ui/core/';
import { BasePropertyProps } from 'admin-bro';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));


const NewInvoiceAction: React.FC<BasePropertyProps> = (props) => {


    const [rowsArray, setRowsArray] = useState([1, 2])
    const [ selectedPaymentMethod, changeSelectedPaymentMethod ] = useState('CASH')
    const [ selectedPaymentStatus, changeSelectedPaymentStatus ] = useState('UNPAID')
    const [ error, setError ] = useState(undefined);

    const classes = useStyles();

    useEffect (() => {

    }, [rowsArray]) 


    const handleInvoiceCreateSubmit = async (e) => {

        try {
            e.preventDefault();

            const invoiceNumber = document.getElementById('invoicenumberinput').value;
            const customerCode = document.getElementById('customercodeinput').value;
            const customer = document.getElementById('customerinput').value;
            const totalPrice = document.getElementById('totalpriceinput').value;

            const nodeList = document.querySelectorAll('.orderrow')

            const ordersArray = [...nodeList].map(node => {

                 const inputNodes = node.querySelectorAll('input')
                 return {quantity: inputNodes[0].value, packing: inputNodes[1].value, item: inputNodes[2].value}
            })

            let payStatus = selectedPaymentStatus

            if (selectedPaymentMethod === 'NET30') {

                payStatus = 'PAID'
            }

            const response = await fetch(`${window.location.origin}/invoicecreate`, {

                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    payload: {

                        number: invoiceNumber,
                        customer: customer,
                        customerCode: customerCode,
                        
                        price: totalPrice,
                        status: payStatus,
    
                        paymentMethod: selectedPaymentMethod,

                        orderItems: ordersArray
                        
                    }

                }),

            });

            const data = await response.json();

            if (data.message){
                alert('Check fields and try again')
            }else{
                props.history.push('/admin/resources/Invoice');
            }
            
        
        } catch(err) {
            setError(err.message);
            console.log(err.message)
        }

    }

    const handleAddRow = () => {

        setRowsArray([...rowsArray, (rowsArray.length+1)])
        
    }


    const handleRowDelete = (e, value) => {


        if (rowsArray.length > 1) {

            if (e.target.nodeName === "svg") {

                const nodeArray = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.children
                e.target.parentNode.parentNode.parentNode.parentNode.remove()

            }
    
    
            if (e.target.nodeName === "path") {

                const nodeArray = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove()

            }            
        }

    }


    const createTableRows = (rowsArray) => (
       
        rowsArray.map((row, index, array) => (
            <TableRow  className='orderrow'>

                <TableCell><Box color='red' onClick={()=>handleAddRow()}  flex justifyContent='center' alignItems='center'  >
                    
                    { index === 0 ? (<Icon icon='AddFilled' />) : (null)}
                    
                    </Box></TableCell>
                <TableCell><Input width='50px' /></TableCell>
                <TableCell><Input width='100px' /></TableCell>
                <TableCell><Input minWidth='50px' /></TableCell>

                <TableCell><Box color='red' onClick={(e)=>handleRowDelete(e, row)}  flex justifyContent='center' alignItems='center' >
                    
                    { index === 0 ? (null) : (<Icon icon='Close' />) }

                    </Box></TableCell>

            </TableRow>
        ))

    )


    return (

        <Box variant="grey">

        <Box variant='white'>

        <form onSubmit={(e)=> handleInvoiceCreateSubmit(e)}> 

                <Table>

                    <TableHead>
                        <TableRow>

                        <TableCell>
                                                    Invoice Number
                            <Icon icon="CaretUp" />
                            
                        </TableCell>

                        
                        <TableCell>
                                                    Customer Code
                            <Icon icon="CaretUp" />
                            
                        </TableCell>

                        <TableCell>
                                                    Customer
                            <Icon icon="CaretUp" />
                            
                        </TableCell>
                        <TableCell>
                                                    Customer Type
                            <Icon icon="CaretDown" />
                            
                        </TableCell>
                        <TableCell>
                                                    Status
                            <Icon icon="CaretDown" />
                            
                        </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>

                        <TableRow>
                            <TableCell><Input id="invoicenumberinput"  /> </TableCell>
                            <TableCell><Input id="customercodeinput"  /> </TableCell>
                            <TableCell><Input id="customerinput"  /> </TableCell>
                                <TableCell>
                                
                                <FormControl className={classes.formControl}>
                                    
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedPaymentMethod}
                                        onChange={(e)=> changeSelectedPaymentMethod(e.target.value)}
                                    >

                                        <MenuItem value='CASH'> Cash </MenuItem>
                                        <MenuItem value='NET30'> NET30 </MenuItem>

                                    </Select>
                                </FormControl>                                            
                            
                                </TableCell>

                                <TableCell>


                                    <FormControl className={classes.formControl}>
                                        
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectedPaymentStatus}
                                            disabled={ selectedPaymentMethod === 'NET30' ? (true): (false) }
                                            onChange={(e)=> changeSelectedPaymentStatus(e.target.value)}
                                        >

                                            <MenuItem value='UNPAID'> Unpaid </MenuItem>
                                            <MenuItem value='PAID'> Paid </MenuItem>


                                        </Select>
                                    </FormControl>                                            
                                
                                </TableCell>

                        </TableRow>

                    </TableBody>
                </Table>
                

            <Box maxWidth='300px' marginTop='xxl'>

                <Table>

                    <TableHead>
                        <TableRow>
                        <TableCell ></TableCell>

                        <TableCell>
                                                    Quantity

                        </TableCell>
                        <TableCell>
                                                    Packing
                            
                        </TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell ></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {createTableRows(rowsArray)}

                    </TableBody>
                </Table>

                <Label style={{marginTop: 30 + 'px'}} htmlFor="input1">Total Price</Label>
                <Input  id='totalpriceinput' />
                <Input  style={{marginTop: 10 + 'px'}} type='submit' width={1/2} />

            </Box>
        
        </form>
        </Box>

        </Box>

    )
}

export default withRouter(NewInvoiceAction);