import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { Box, Button, ButtonCSS, Input, TableCaption, Text, Icon, TableHead, TableRow, TableCell, CheckBox, Link, TableBody, Table, Badge, Label } from '@admin-bro/design-system';
import { Box, Button, ButtonCSS, Input, Text, Icon, CheckBox, Link, Badge, Label } from '@admin-bro/design-system';
import { TableCaption,FormControl, TableHead, TableRow, TableCell, Typography, TableBody, Table, MenuItem, Select} from '@material-ui/core/';
import { BasePropertyProps } from 'admin-bro';
import { priceFormat } from './../../helpers' 

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
// import Select from '@material-ui/core/Select';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

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



    const handleCustomerCreateSubmit = async (e) => {

        try {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const userName = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmpassword').value;
            const code = document.getElementById('code').value;
            const trn = document.getElementById('trn').value;


            if (password !== confirmPassword) { 
                
                throw new Error('passwords not matching')
            }


            console.log(window.location.origin)

            const response = await fetch(`${window.location.origin}/customer/create`, {

                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    payload: {

                        email,
                        userName,
                        code,
                        password,
                        trn
                                                
                    }

                }),

            });

            const data = await response.json();



            if (data.message){
                alert('Check fields and try again')
            }else{
                props.history.push('/admin/resources/Customer');
            }
            
        
        } catch(err) {
            setError(err.message);
            alert(err.message)
        }

    }


    return (



        <Box variant="grey">
            <Box variant="white">

            <Grid container spacing={1}>

                <form autocomplete="off" style={{width: 100 + '%'}} onSubmit={(e)=> handleCustomerCreateSubmit(e)}> 

                <Grid style={{width: 100 + '%'}} item>

                    <Box marginBottom='16px'>

                        <Label marginBottom='default' htmlFor="input1">Email</Label>

                        <Input type='email' marginBottom='28px' style={{width: 100 + '%'}}  id='email' />



                    </Box>

                </Grid>

                <Grid style={{width: 100 + '%'}} item>

                    <Box marginBottom='16px'>

                        <Label marginBottom='default' htmlFor="input2">User Name</Label>

                        <Input  marginBottom='28px' style={{width: 100 + '%'}} id='username' />

                    </Box>

                </Grid>

                <Grid style={{width: 100 + '%'}} item>

                    <Box marginBottom='16px'>

                        <Label marginBottom='default' htmlFor="input3" >Password</Label>

                        <Input type='password'  marginBottom='28px' style={{width: 100 + '%'}} id='password' />

                    </Box>

                </Grid>



                <Grid style={{width: 100 + '%'}} item>

                    <Box marginBottom='16px'>

                        <Label marginBottom='default' htmlFor="input3" >Confirm Password</Label>

                        <Input type='password'  marginBottom='28px' style={{width: 100 + '%'}} id='confirmpassword' />

                    </Box>

                </Grid>


                <Grid style={{width: 100 + '%'}} item>

                    <Box marginBottom='16px'>

                        <Label marginBottom='default' htmlFor="input4">Code</Label>

                        <Input  marginBottom='28px' style={{width: 100 + '%'}} id='code' />

                    </Box>

                </Grid>


                <Grid style={{width: 100 + '%'}} item>

                    <Box marginBottom='16px'>

                        <Label marginBottom='default' htmlFor="input5">TRN</Label>

                        <Input  marginBottom='28px' style={{width: 100 + '%'}} id='trn' />

                    </Box>

                </Grid>

                <div style={{width: 100 + '%', textAlign: 'center' }} >

                    <Button size='lg' variant='primary' type='submit'>Save</Button>

                </div>

                </form>

            </Grid>
            </Box>
        </Box>




    )
}

export default withRouter(NewInvoiceAction);