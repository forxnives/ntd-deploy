import React, {useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Box, Button } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
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



const BulkAddToDeposit: React.FC<BasePropertyProps> = (props) => {


    const { records } = props;
    const [ fetchedDeposits, setFetchedDeposits ] = useState([]);
    const [ selectedDeposit, setSelectedDeposit ] = useState({});
    const classes = useStyles();


    useEffect(() => {

        async function depositsFetch () {
            const response = await fetch(`${window.location.origin}/depositadd`);
            const data = await response.json();

            setFetchedDeposits(data.data);
            setSelectedDeposit(data.data[0]._id);
        }

        depositsFetch();
        
    },[])


    const handleDepositAdd = async () => {

        try {

            let filteredRecords = records.filter(record => (
                record.params.status === 'PAID'
            ))


            if (!filteredRecords.length) {
                throw new Error('no paid invoices being added')
            }

            const response = await fetch(`${window.location.origin}/depositadd`, {

                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },

                body: JSON.stringify({

                    depositId: selectedDeposit,

                    payload: {

                        invoices: filteredRecords.map(record => ({

                            invoiceId: record.params._id,
                            invoiceNumber: record.params.number

                        })),
                    }
                }),
            });

            const data = await response.json();

            props.history.push('/admin/resources/Invoice');

        } catch (err){
            alert(err.message)
        }

    }

    return (

        <Box marginBottom='xxl'>

            <Box marginBottom='xxl'>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Select Deposit</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedDeposit}
                        onChange={(e)=> setSelectedDeposit(e.target.value)}
                    >

                        { fetchedDeposits.map( deposit => (
                            <MenuItem value={deposit._id}>{deposit._id}</MenuItem>
                        )) }

                    </Select>
                </FormControl>
            </Box>

            <Box marginBottom='xxl'>                
                <Button onClick={handleDepositAdd} > Add To Deposit </Button>
            </Box>
        </Box>
    )
}

export default withRouter(BulkAddToDeposit);