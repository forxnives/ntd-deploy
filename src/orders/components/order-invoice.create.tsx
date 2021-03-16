import React from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS  } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const CreateInvoice: React.FC<BasePropertyProps> = (props) => {


    const { record } = props;



    const ButtonLikeComponent = styled.a`
  ${ButtonCSS};
`


    return (

        <div>
            <h1> Create Invoice </h1>
            <ButtonLikeComponent href="/admin/resources/Invoice/actions/new">Create</ButtonLikeComponent>

        </div>
    )
}

export default CreateInvoice