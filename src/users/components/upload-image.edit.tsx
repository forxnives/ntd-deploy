import React from 'react';

import {Label, Box, DropZone, DropZoneProps, DropZoneItem} from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const Edit: React.FC<BasePropertyProps> = (props) => {

    const { property, onChange, record } = props;


    const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
        onChange(property.name, files[0]);
    }

    const uploadedPhoto = record.params.displayPicPath;
    
    // const photoToUpload = record.params[property.name];
    


    return (

        <Box marginBottom='xxl'> 
            <Label> {property.label} </Label>

                <img width='100px' src={uploadedPhoto} />

            <DropZone onChange={handleDropZoneChange}/>
            { uploadedPhoto && (
                <DropZoneItem src={`${record.params.displayPicPath}`} />
            )}

        </Box>
    )
}

export default Edit