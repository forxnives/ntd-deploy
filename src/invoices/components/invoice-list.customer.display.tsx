import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import { priceFormat } from '../../helpers' 


const Ting: React.FC<BasePropertyProps> = ({ record }) => {



    const breakClassNodes = document.querySelectorAll('.iIxmbw');

    const rowClassNodes = document.querySelectorAll('tr');

    


    breakClassNodes.forEach( node => {
        // node.classList.remove("iIxmbw");
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