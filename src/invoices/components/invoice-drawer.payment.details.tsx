import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, Button, ButtonCSS, Input, DropZone, DropZoneProps, DropZoneItem } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import Typography from '@material-ui/core/Typography';
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
  


const PaymentDetailsDrawer: React.FC<BasePropertyProps> = ({drillProps, toggleDrawer}) => {


    const { property, record, onChange } = drillProps;

    const classes = useStyles();
    const [value, setValue] = useState(0); 
    const [ chequeNumber, setChequeNumber ] = useState(null);
    
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
          formData.append("data", file)

          if (chequeNumber){
            formData.append("chequeNumber", chequeNumber )
          }

          const response = await fetch(`${window.location.origin}/invoicedocupload/${docType}`, {

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


    const handleChequeNumberSubmit = () => {

      const chequeNumber = document.getElementById('chequenumberinput')
        setChequeNumber(chequeNumber.value)

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

    const ReturnDownloadButton = styled.a`${ButtonCSS};`


    return (

        <Box >
           
            <div className={classes.root}>
                <AppBar position="static">

                {true && (
                  <Tabs centered value={value} onChange={handleChange} aria-label="Payment Option Tabs">
                  <Tab label="Cheque" {...a11yProps(0)} />
                  <Tab label="Transfer" {...a11yProps(1)} />
                  <Tab label="Cash Deposit" {...a11yProps(2)} />
                  </Tabs>
                )}

                </AppBar>
                <TabPanel value={value} index={record.params["paymentDoc.paymentDocType"] && record.params["paymentDoc.paymentDocType"] !== 'CHEQUE' ? (1) : (0) }>
                                
                <Box>

                    { record.params["paymentDoc.paymentDocPath"] ? (                     

                    <Box>

                        <DropZoneItem  filename={`${record.params["paymentDoc.paymentDocName"]}`}/>

                        <Box flex justifyContent='center'>
                            <ReturnDownloadButton 
                                onClick={() => toggleDrawer(false)} 
                                margin='lg' 
                                href={`${window.location.origin}/download/cheque/${record.params._id}/${record.params["paymentDoc.paymentDocPath"]}/${record.params["paymentDoc.paymentDocName"]}`}> 
                                Download 
                            </ReturnDownloadButton>
                            <Button onClick={() => handleDelete('CHEQUE')} margin='lg' variant='danger'> Delete </Button>
                        </Box>
                    </Box>
                    
                    ) : (


                    !chequeNumber ? ( <Box> <h1>Enter Cheque Number</h1> <Input id='chequenumberinput'/> <Button onClick={()=> handleChequeNumberSubmit() }> Submit </Button> </Box> ) : (

                       
                    <DropZone onChange={(files)=> handleDropZone(files, 'cheque')}>

                    </DropZone>
                    ))}

                </Box>
                </TabPanel>

                <TabPanel value={value} index={record.params["paymentDoc.paymentDocType"] && record.params["paymentDoc.paymentDocType"] === 'TRANSFER' ? (0) : (1) }>
                
                <Box>

                    { record.params["paymentDoc.paymentDocPath"] ? (                     

                    <Box>
                        
                        <DropZoneItem  filename={`${record.params["paymentDoc.paymentDocName"]}`}/>

                        <Box  flex justifyContent='center'>

                            <ReturnDownloadButton 
                                onClick={() => toggleDrawer(false)} 
                                margin='lg' 
                                href={`${window.location.origin}/download/transfer/${record.params._id}/${record.params["paymentDoc.paymentDocPath"]}/${record.params["paymentDoc.paymentDocName"]}`}>
                                Download 
                            </ReturnDownloadButton>

                            <Button onClick={() => handleDelete('TRANSFER')} margin='lg' variant='danger'> Delete </Button>
                        </Box>

                    </Box>
                    
                    ) : (

                    <DropZone onChange={(files)=> handleDropZone(files, 'transfer')}>

                    </DropZone>

                    )}

                </Box>
                      
                </TabPanel>



                <TabPanel value={value} index={record.params["paymentDoc.paymentDocType"] && record.params["paymentDoc.paymentDocType"] === 'DEPOSIT' ? (0) : (2) }>
                
                <Box>
    
                    { record.params["paymentDoc.paymentDocPath"] ? (                     

                    <Box>
                        
                        <DropZoneItem  filename={`${record.params["paymentDoc.paymentDocName"]}`}/>

                        <Box  flex justifyContent='center'>

                            <ReturnDownloadButton 
                                onClick={() => toggleDrawer(false)} 
                                margin='lg' 
                                href={`${window.location.origin}/download/deposit/${record.params._id}/${record.params["paymentDoc.paymentDocPath"]}/${record.params["paymentDoc.paymentDocName"]}`}>
                                Download 
                            </ReturnDownloadButton>

                            <Button onClick={() => handleDelete('DEPOSIT')} margin='lg' variant='danger'> Delete </Button>
                        </Box>

                    </Box>
                    
                    ) : (

                    <DropZone onChange={(files)=> handleDropZone(files, 'deposit')}>

                    </DropZone>

                    )}

                </Box>
                      
                </TabPanel>

            </div>
        </Box>
    )
}

export default PaymentDetailsDrawer;