import React from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const DisplayCustomer: React.FC<BasePropertyProps> = (props) => {


    const { record } = props;


    
    return (

        <Box marginBottom='xxl'>
            <h1> {record.params.customer} </h1>
            {/* <ButtonLikeComponent href="/admin/resources/Invoice/actions/new">Create</ButtonLikeComponent> */}

        </Box>
    )
}

export default DisplayCustomer;