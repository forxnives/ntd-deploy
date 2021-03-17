import React from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS, DropZone, DropZoneProps, DropZoneItem } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


const BankRecieptSupportingDocs: React.FC<BasePropertyProps> = ({drillProps, toggleDrawer}) => {

    const { property, record, onChange } = drillProps;

    const ReturnDownloadButton = styled.a`${ButtonCSS};`

    const handleDropZone: DropZoneProps['onChange'] = async (files, docType) => {

        try {
  
            const formData = new FormData();
            const file = files[0];
  
            formData.append("documentType", docType.toUpperCase())
            formData.append("record", JSON.stringify(record))  
            formData.append("data", file)
  
            const response = await fetch(`${window.location.origin}/depositdocupload/${docType}`, {
  
                method: 'POST',
                body: formData,
  
            })
  
            if (response.status===500) {
                throw new Error('Upload Failure')
            }
  
            alert('Upload Successful')
            window.location.reload()
  
  
        }catch(err){
            alert(err.message)
            document.querySelector('.gkvdnn').remove()
            toggleDrawer(false)
        }
  
    }


    const handleDelete = async (typeToDelete) => {

        try {
            const response = await fetch(`${window.location.origin}/delete/${typeToDelete}`, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                  },
            
                body: JSON.stringify({
        
                    payload: record.params
                    
                }),
            })
    
            if (response.status===500) {

                throw new Error('Upload Failure')
            }

            alert('Successfully Deleted')
            window.location.reload()

          } catch (err) {
            console.log(err)
        }
    }


    return (


    <Box>

        { record.params["supportingDocs.bankReciept.bankRecieptDocName"] ? (                     

        <Box>
            
            <DropZoneItem  filename={`${record.params["supportingDocs.bankReciept.bankRecieptDocName"]}`}/>

            <Box  flex justifyContent='center'>

                <ReturnDownloadButton onClick={() => toggleDrawer(false)} margin='lg' href={`${window.location.origin}/download/bankreciept/${record.params._id}/${record.params["supportingDocs.bankReciept.bankRecieptDocPath"]}/${record.params["supportingDocs.bankReciept.bankRecieptDocName"]}`}> Download </ReturnDownloadButton>
                <Button onClick={() => handleDelete('BANKRECIEPT')} margin='lg' variant='danger'> Delete </Button>

            </Box>

        </Box>
        
        ) : (

        <DropZone onChange={(files) => handleDropZone(files, 'bankreciept')}>  

        </DropZone>

        )}

    </Box>

    )
}

export default BankRecieptSupportingDocs;