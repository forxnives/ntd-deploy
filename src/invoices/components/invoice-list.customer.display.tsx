import React, { useEffect } from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';

const Ting: React.FC<BasePropertyProps> = ({ record }) => {

    const breakClassNodes = document.querySelectorAll('.iIxmbw');

    breakClassNodes.forEach( node => {
        node.style.display = 'table-cell';
    } )

    useEffect(() =>{

        if (record.params.depositId) {
            const invoiceRow = document.querySelector(`[data-id="${record.params._id}"]`);
            invoiceRow.style.backgroundColor= '#C5D1FC';
        }

    },[])


    return (

        <Box >
            <h1> {record.params.customer} ({record.params.paymentMethod}) </h1>
        </Box>
    )
}

export default Ting;