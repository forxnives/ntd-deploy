import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS, Table, TableRow, TableCell, TableCaption, TableHead, TableBody,  Text, Icon,   } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


import {createObjectsFromParams } from '../../helpers.js'


const DisplayOrder: React.FC<BasePropertyProps> = (props) => {


    const { record } = props;


    useEffect(() => {
        // Update the document title using the browser API
        document.querySelector('.admin-bro_H2').innerText = `P.O from ${record.params.customer}`;
        const breadcrumbs = document.querySelectorAll('.breadcrumbs__BreadcrumbLink-yjyesi-0')
        breadcrumbs[2].innerText = 'Reply';
      });



    const tableRows = (requestObjects) => {
        return requestObjects.map(object => (
            <TableRow>
            <TableCell>{`${object.quantity}`}</TableCell>
            <TableCell>{`${object.packing}`}</TableCell>
            <TableCell>{`${object.item}`}</TableCell>


            </TableRow>
        ))
    }


    return (

        <Box marginTop='xxl'>
            {/* <h1>REQUASTS</h1> */}

            <Table>
                <TableCaption>
                    <Text as="span">{`${record.params.customer}`}</Text>

                </TableCaption>
                <TableHead>
                    <TableRow>

                    <TableCell>
                                                Quantity
                        <Icon icon="CaretUp" />
                        
                    </TableCell>
                    <TableCell>
                                                Packing
                        <Icon icon="CaretDown" />
                        
                    </TableCell>
                    <TableCell>Description</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>

                    {tableRows(createObjectsFromParams(record.params, 'requests'))}


                </TableBody>
            </Table>


        </Box>
    )
}

export default DisplayOrder;