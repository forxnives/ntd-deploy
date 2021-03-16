import React from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const DepositListInvoiceShow: React.FC<BasePropertyProps> = (props) => {

const paramKeys = Object.keys(props.record.params);
const invoiceNumbers = paramKeys.filter(param => (
    param.includes('invoiceNumber')
))

    return (

        <Box>
            <h1>{`${invoiceNumbers.length}`}</h1>

        </Box>
    )
}

export default DepositListInvoiceShow;