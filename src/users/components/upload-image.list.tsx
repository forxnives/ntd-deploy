import React from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const List: React.FC<BasePropertyProps> = (props) => {

    const { record } = props;

    const srcImg = record.params['displayPicPath']

    return (

        <Box>
            {
                srcImg ?
                (<img src={srcImg} width='100px' /> ) :
                ( 'no image' )

            }

        </Box>
    )
}

export default List