import React from 'react';
import { Box, Button, ButtonCSS  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import { withRouter } from 'react-router-dom';


const BulkCreateDeposit: React.FC<BasePropertyProps> = (props) => {


    const { records } = props;


    const handleDepositCreate = async () => {

        try {

            let filteredRecords = records.filter(record => (
                record.params.status === 'PAID'
            ))


            if (!filteredRecords.length) {
                throw new Error('no paid invoices being added')
            }

            const response = await fetch(`${window.location.origin}/depositadd`, {

                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },

                body: JSON.stringify({

                    payload: {
                    
                        status: 'PENDING',

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


    const invoiceNumbers = records.reduce((acc, record, i) => {

        if (i === records.length - 2 ){
            return acc + ' '+ record.params.number + ' and';
        }

        if (i === records.length - 1){
            return acc + ' ' + record.params.number;
        }

        return acc + ' ' + record.params.number + ',';
    }, '');


    return (

        <Box marginBottom='xxl'>
            <h1> Would you like to add invoice{records.length === 1 ? (' ') : ('s ') } {invoiceNumbers} to a new deposit ? </h1>
            
            <Button marginTop='lg' onClick={()=> handleDepositCreate()}>Create Deposit</Button>

        </Box>
    )
}

export default withRouter(BulkCreateDeposit);