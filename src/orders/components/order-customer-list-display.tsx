import React from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';



const DisplayCustomer: React.FC<BasePropertyProps> = (props) => {


    const { record } = props;

    const breakClassNodes = document.querySelectorAll('.iIxmbw');


    breakClassNodes.forEach( node => {
        // node.classList.remove("iIxmbw");
        node.style.display = 'table-cell';
    } )






    return (

        <Box  >
            <h1> {record.params.customer} </h1>
            {/* <ButtonLikeComponent href="/admin/resources/Invoice/actions/new">Create</ButtonLikeComponent> */}

        </Box>
    )
}

export default DisplayCustomer;