import React from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import { createObjectsFromParams } from '../../helpers.js';


const DisplayCustomer: React.FC<BasePropertyProps> = (props) => {

    const { record } = props;

    const breakClassNodes = document.querySelectorAll('.iIxmbw');

    breakClassNodes.forEach( node => {
        node.style.display = 'table-cell';
    } )

    const invoices = createObjectsFromParams(record.params, 'orders')

    return (

        <Box  >
            <h1> {invoices.length} </h1>
        </Box>
    )
}

export default DisplayCustomer;