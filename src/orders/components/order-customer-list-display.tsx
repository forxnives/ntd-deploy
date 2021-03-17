import React from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const DisplayCustomer: React.FC<BasePropertyProps> = (props) => {

    const { record } = props;
    const breakClassNodes = document.querySelectorAll('.iIxmbw');

    breakClassNodes.forEach( node => {
        node.style.display = 'table-cell';
    } )

    return (

        <Box  >
            <h1> {record.params.customer} </h1>
        </Box>
    )
}

export default DisplayCustomer;