// import { useState, useEffect } from 'React';
import { ApiClient } from 'admin-bro'
import { Box, Link, LinkProps, Icon, IconProps } from '@admin-bro/design-system'

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {priceFormat} from './helpers'

const api = new ApiClient()

const Dashboard = () => {
  const [invoiceInfo, setInvoiceinfo] = React.useState({})

  React.useEffect(() => {


    // api.getDashboard().then((response) => {
    //   setData(response.data)
    // })

    api.resourceAction({ resourceId: 'Invoice', actionName: 'list' }).then(results => {
        // setData(results)
        
        const invoicesInfo = results.data.records.reduce((accumulator, record) => {

            let recordTotal = 0

            if (record.params['returned.returnAmount']){

                recordTotal = record.params.price - record.params['returned.returnAmount']
            }else{
                recordTotal = record.params.price
            }

            accumulator.total = accumulator.total + recordTotal

            if (record.params.status === 'UNPAID') {
                accumulator.outstanding = accumulator.outstanding + recordTotal 
            }



            return accumulator

        }, {total: 0, outstanding: 0})

        const total = priceFormat(invoicesInfo.total)
        const outstanding = priceFormat(invoicesInfo.outstanding)
        setInvoiceinfo({total, outstanding})
    })



  }, [])


  return (



    // <Box variant="grey">

    //     <Box margin='lg' padding='sm' variant="white">
    //         <img style={{width: 100 + '%'}} src={'http://www.ntdingredientes.com.jm/wp-content/uploads/2020/01/Header-Productos-1920x600-V2.jpg'} ></img>
    //     </Box>

    //     <Box margin='lg' bg="primary20" p="md" width={1/2} variant="white">
    //         {invoiceInfo.total}
    //     </Box>

    //     <Box margin='lg' bg="primary20" p="md" width={1/2} variant="white">
    //         {invoiceInfo.outstanding}
    //     </Box>

    // </Box>


    <Container maxWidth="lg">



        <Grid container spacing={2}>

            <Grid item xs={12} md={6} lg={6}>
                <Box margin='lg' bg="primary20" p="md" variant="white">

                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Total Invoices
                </Typography>



                <Typography component="p" variant="h4">
                    {invoiceInfo.total}
                </Typography>
                <Typography color="textSecondary" >

                </Typography>
                </Box>

            </Grid>

            <Grid item xs={12} md={6} lg={6}>
                <Box margin='lg' bg="primary20" p="md" variant="white">

                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Total Outstanding
                    </Typography>



                    <Typography component="p" variant="h4">
                        {invoiceInfo.outstanding}
                    </Typography>
                    <Typography color="textSecondary" >

                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
                <Box margin='lg' padding='sm' variant="white">
                    <img style={{width: 100 + '%'}} src={'http://www.ntdingredientes.com.jm/wp-content/uploads/2020/01/Header-Productos-1920x600-V2.jpg'} ></img>
                </Box>
            </Grid>


            <Grid item xs={12} md={4} lg={4}>
            <Link href={'/admin/resources/Order'}>
                <Box flex alignItems='center' margin='lg' bg="primary20" p="md" variant="white">



                        <Icon size={32} icon="RequestQuote" />






                        <div style={{width: 100 + '%', textAlign: 'center'}} >Orders</div>

                </Box>
                </Link>
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
            <Link href={'/admin/resources/Invoice'}>
                <Box flex alignItems='center' margin='lg' bg="primary20" p="md" variant="white">


                    <Icon size={32} icon="ListChecked" />
                    <div style={{width: 100 + '%', textAlign: 'center'}} >Invoices</div>

                </Box>
                </Link>

            </Grid>

            <Grid item xs={12} md={4} lg={4}>
            <Link href={'/admin/resources/Deposit'}>
                <Box flex alignItems='center' margin='lg' bg="primary20" p="md" variant="white">

                    <Icon size={32} icon="Money" />

                    <div style={{width: 100 + '%', textAlign: 'center'}} >Deposits</div>


                </Box>
                </Link>
            </Grid>

        </Grid>

    </Container>



  )
}

export default Dashboard