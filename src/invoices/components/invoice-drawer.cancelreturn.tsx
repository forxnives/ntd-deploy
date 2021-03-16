import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS, Icon, Input, Table, TableBody, TableCaption, TableHead, TableRow, TableCell, Text, DropZone, DropZoneProps, DropZoneItem, Label } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import { priceFormat } from './../../helpers';
import Typography from '@material-ui/core/Typography';
import { unflatten } from 'flat';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';



function TabPanel(props) {

    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));
  


const InvoiceCancelReturnDrawer: React.FC<BasePropertyProps> = ({drillProps, toggleDrawer}) => {


    const { property, record, onChange } = drillProps;

    const classes = useStyles();
    const [value, setValue] = useState(0); 
    const [ returnAmount, setReturnAmount ] = useState(null);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };


    const onUpload = (files: FileList) => {
        const newRecord = {...record}
        const file = files.length && files[0]
    
        onChange({
          ...newRecord,
          params: {
            ...newRecord.params,
            [property.name]: file,
          }
        })
        event.preventDefault()
      } 


    const handleDropZone: DropZoneProps['onChange'] = async (files, docType) => {

      try {

          const formData = new FormData();
          const file = files[0];

          formData.append("documentType", docType.toUpperCase())
          formData.append("record", JSON.stringify(record))
          if (returnAmount){
            formData.append("returnAmount", returnAmount )
          }

          formData.append("data", file)

          const response = await fetch(`http://localhost:3000/invoicedocupload/${docType}`, {

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




    
    const handleReturnAmountSubmit = () => {

      const returnInput = document.getElementById('returnamountinput')
      if (isNaN(returnInput.value)) {
        alert('Please Enter a Number')
      }else {
        setReturnAmount(returnInput.value)
      }

    }


    const handleDelete = async (typeToDelete) => {

        try {
            const response = await fetch(`http://localhost:3000/delete/${typeToDelete}`, {

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

    const ReturnDownloadButton = styled.a`${ButtonCSS};`


    return (

        <Box >
           
            <div className={classes.root}>
                <AppBar position="static">

                {record.params.docStatus === 'NORMAL' && (
                  <Tabs centered value={value} onChange={handleChange} aria-label="Cancel/Return Tabs">
                  <Tab label="Return" {...a11yProps(0)} />
                  <Tab label="Cancellation" {...a11yProps(1)} />
                  {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
                  </Tabs>
                )}

                </AppBar>
                <TabPanel value={value} index={record.params.docStatus === 'CANCELLED' ? (1) : (0) }>
                <Box>

                    { record.params["returned.returnDocPath"] ? (                     

                    <Box>

                        <DropZoneItem  filename={`${record.params["returned.returnDocName"]}`}/>

                        <Box  flex justifyContent='center'>
                            <ReturnDownloadButton onClick={() => toggleDrawer(false)} margin='lg' href={`http://localhost:3000/download/return/${record.params._id}/${record.params["returned.returnDocPath"]}/${record.params["returned.returnDocName"]}`}> Download </ReturnDownloadButton>
                            <Button onClick={() => handleDelete('RETURN')} margin='lg' variant='danger'> Delete </Button>
                        </Box>
                    </Box>
                    
                    ) : (

                       !returnAmount ? ( <Box> <h1>Enter Return Amount</h1> <Input id='returnamountinput'/> <Button onClick={()=> handleReturnAmountSubmit() }> Submit </Button> </Box> ) : (

                    <DropZone onChange={(files)=> handleDropZone(files, 'return')}>

                    </DropZone>
                    ))}

                </Box>
                </TabPanel>


                <TabPanel value={value} index={record.params.docStatus === 'CANCELLED' ? (0) : (1)}>

                <Box>

                    { record.params["cancelled.cancelDocPath"] ? (                     

                    <Box>
                        
                        <DropZoneItem  filename={`${record.params["cancelled.cancelDocName"]}`}/>

                        <Box  flex justifyContent='center'>
                            <ReturnDownloadButton onClick={() => toggleDrawer(false)} margin='lg' href={`http://localhost:3000/download/cancel/${record.params._id}/${record.params["cancelled.cancelDocPath"]}/${record.params["cancelled.cancelDocName"]}`}> Download </ReturnDownloadButton>
                            <Button onClick={() => handleDelete('CANCEL')} margin='lg' variant='danger'> Delete </Button>
                        </Box>

                    </Box>
                    
                    ) : (
                    // <Label>{'upload'}</Label>
                    <DropZone onChange={(files)=> handleDropZone(files, 'cancel')}>

                    </DropZone>
                    )}

                </Box>
                      
                </TabPanel>
            </div>
        </Box>
    )
}

export default InvoiceCancelReturnDrawer;