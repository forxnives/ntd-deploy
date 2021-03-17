import React from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const DisplayCustomer: React.FC<BasePropertyProps> = (props) => {

    const { record } = props;

    return (

        <Box marginBottom='xxl'>
            <h1> {record.params.customer} </h1>
        </Box>
    )
}

export default DisplayCustomer;