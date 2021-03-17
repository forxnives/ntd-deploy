import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, ButtonCSS, ModalInline, Input, Icon, Text, Label, Table, TableRow, TableCell, TableCaption, TableHead, TableBody } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import {createObjectsFromParams } from '../../helpers.js';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));



const DisplayInvoice: React.FC<BasePropertyProps> = (props) => {

    const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
    const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState(false);
    const [ error, setError ] = useState(undefined);
    const [ selectedPaymentMethod, changeSelectedPaymentMethod ] = useState('CASH')
    const [ selectedPaymentStatus, changeSelectedPaymentStatus ] = useState('UNPAID')
    const classes = useStyles();

    const availabilityModalProps = {
    
    onOverlayClick: () => setAvailabilityModalOpen(false),
    onClose: () => setAvailabilityModalOpen(false),
    }

    const createInvoiceModalProps = {
    
    onOverlayClick: () => setAvailabilityModalOpen(false),
    onClose: () => setAvailabilityModalOpen(false),
    }

    const ButtonLikeComponent = styled.a`${ButtonCSS}`;
    const { record } = props;


    const replyTableRows = (requestObjects) => {
        return requestObjects.map(object => (
            <TableRow>
                <TableCell><Input id="quantityinput" placeholder={object.quantity}  width={1/2} /> </TableCell>
                <TableCell><Input id="packinginput" placeholder={object.packing} /></TableCell>
                <TableCell><Input id="iteminput" placeholder={object.item} /></TableCell>


            </TableRow>
        ))
    }

    const availabilityObjectConstruct = (quantityNodes, packingNodes, itemNodes) => {

        const quantityArray = Array.from(quantityNodes);
        const packingArray = Array.from(packingNodes);
        const itemArray = Array.from(itemNodes);
        
        return quantityArray.map((itemQuantity, i) => {

            return {
                quantity: (itemQuantity.value ? itemQuantity.value : record.params[`requests.${i}.quantity`]),

                packing: (packingArray[i].value ? packingArray[i].value : record.params[`requests.${i}.packing`]),
                item: (itemArray[i].value ? itemArray[i].value : record.params[`requests.${i}.item`]),
            };
        })
    }


    const handleAvailabilitySubmit = async (e) => {
        try {

            e.preventDefault();
            const quantityNodes = document.querySelectorAll('[id=quantityinput]');
            const packingNodes = document.querySelectorAll('[id=packinginput]');
            const itemNodes = document.querySelectorAll('[id=iteminput]');
            const price = document.querySelector('#totalpriceinput');


            const response = await fetch(`${window.location.origin}/orderreply`, {

                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    availability: availabilityObjectConstruct(quantityNodes, packingNodes, itemNodes),
                    totalPrice: price.value,
                    orderId: record.params._id
                }),

              }
              );
              const data = await response.json();

              props.history.push('/admin/resources/Order');

        } catch (err) {
            setError(err.message);
            console.log(err.message)
        }
        
    }

    const handleInvoiceCreateSubmit = async (e) => {
        try {
            e.preventDefault();

            const invoiceNumber = document.getElementById('invoicenumberinput').value;
            const totalPrice = props.record.params.replyTotalPrice

        
            const response = await fetch(`${window.location.origin}/invoicecreate`, {

                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    orderId: record.params._id,

                    payload: {

                        number: invoiceNumber,
                        customer: record.params.customer,
                        customerCode: record.params.customerCode,
                        customerId: record.params.customerId,
                        price: totalPrice,
                        status: selectedPaymentStatus,
                        orderId: record.params._id,
                        paymentMethod: selectedPaymentMethod,
                        
                    }

                }),

            });

            const data = await response.json();

            if (data.message){
                alert('Check fields and try again')
            }else{
                props.history.push('/admin/resources/Order');
            }
            
        } catch(err) {
            setError(err.message);
            console.log(err.message)
        }

    }


    return (

        <Box marginBottom='xxl' marginTop='xxl'>

            {(record.params.invoiceStatus !== 'INVOICECREATED' && record.params.invoiceStatus !== 'INVOICEREQUESTED') && 
            (
                <ButtonLikeComponent onClick={() => setAvailabilityModalOpen(!availabilityModalOpen)}>Reply</ButtonLikeComponent>

            ) }

            {
                (record.params.invoiceStatus === 'INVOICEREQUESTED') && 
                (<ButtonLikeComponent onClick={() => setCreateInvoiceModalOpen(!createInvoiceModalOpen)}>Create Invoice</ButtonLikeComponent>)
            }
    
            {availabilityModalOpen && 
            
            <ModalInline {...availabilityModalProps} >

                <form onSubmit={handleAvailabilitySubmit}> 
                
                <Box marginTop='xxl'>

                    <Table>
                        <TableCaption>
                            <Text as="span">{'Indicate Availability and Total Price'}</Text>

                        </TableCaption>
                        <TableHead>
                            <TableRow>

                            <TableCell>
                                                        Quantity
                                <Icon icon="CaretUp" />
                                
                            </TableCell>
                            <TableCell>
                                                        Packing
                                <Icon icon="CaretDown" />
                                
                            </TableCell>
                            <TableCell>Description</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {replyTableRows(createObjectsFromParams(record.params, 'requests'))}


                        </TableBody>
                    </Table>

                    <Label htmlFor="input1">Total Price</Label>
                    <Input id='totalpriceinput' />
                    <Input type='submit' width={1/2} />


                </Box>
                
                </form>

            </ModalInline>
            
            }

            {createInvoiceModalOpen && 
            
            <ModalInline {...createInvoiceModalProps} >
                <form onSubmit={handleInvoiceCreateSubmit}>

                    <Box marginTop='xxl'>


                        <Table>
                            <TableCaption>
                                <Text as="span">Create Invoice for {`${record.params.customer}`}</Text>

                            </TableCaption>
                            <TableHead>
                                <TableRow>

                                <TableCell>
                                                            Invoice Number
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
                                <TableCell>Total Price</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>

                                <TableRow>
                                    <TableCell><Input id="invoicenumberinput"  /> </TableCell>
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

                                    <TableCell > <div>&nbsp;</div> <h1> ${props.record.params.replyTotalPrice}</h1> <div>&nbsp;</div>  </TableCell>

                                </TableRow>

                            </TableBody>
                        </Table>

                        <Input type='submit' width={1/2} />

                    </Box>
                </form>

            </ModalInline>
            
            }     

        </Box>
    )
}

export default withRouter(DisplayInvoice);