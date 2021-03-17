import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LayersIcon from '@material-ui/icons/Layers';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotesIcon from '@material-ui/icons/Notes';
import NewOrder from './NewOrder';
import ViewOrders from './ViewOrders';
import ViewInvoices from './ViewInvoices';
import Dashboard from './Dashboard';
import Login from "./Login";
import SubmitSuccess from './SubmitSuccess';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link as LinkRoute,
} from "react-router-dom";


function Copyright() {
  return (
    
    <Typography style={{

      position: 'absolute', 
      marginLeft: 'auto',
      marginRight: 'auto',
      left: 0,
      right: 0,
      textAlign: 'center',
      bottom: 3 + 'px'
   
    }} variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a color="inherit" href="https://www.ntdingredientes.com.jm/">
        NTD Ingredientes
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));



function App(props) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const [ ordersArray, setOrdersArray ] = useState([]);
  const [ invoicesArray, setInvoicesArray ] = useState([]);

  const [ orderNotification, setOrderNotification ] = useState(0)
  const [ invoiceNotification, setInvoiceNotification ] = useState(0)

  const [ error, setError ] = useState(undefined);
  const [ update, forceUpdate ] = useState(false)

  const [user, setUser] = useState(undefined);


  const getUser = useCallback(async function() {
    try {
      const response = await fetch("/customer/me");
      const json = await response.json();

      // Handle non 200 responses:
      if (!response.ok) {
        throw new Error(json.message);
      }
      setUser(json.data);
    } catch(e) {
      setUser(undefined);
      console.log(e);
    }
  }, [])
  useEffect(() => {
    getUser();
  }, [getUser]);


  useEffect(()=>{
        
    const retrieveOrders = async (e) => {

        try {
            const response = await fetch(`${window.location.origin}/ordersretrieve`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: user.id
                }),
            })
            if (response.status===500) {
                throw new Error('Failure to retrieve')
            }

            const data = await response.json()
            setOrdersArray(data.data)
          
        } catch(err) {
            setError(err.message);
        }
    }


    const retrieveInvoices = async (e) => {

      try {

            const response = await fetch(`${window.location.origin}/invoicesretrieve`, {

                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: user.id
                }),
            })
            if (response.status===500) {
                throw new Error('Failure to retrieve')
            }

            const data = await response.json()
            setInvoicesArray(data.data)

      }catch (err) {
        setError(err.message)

      }
    }

    retrieveOrders()
    retrieveInvoices()

},[update])

useEffect(() => {

  const repliedOrders = ordersArray.filter(order => (order.invoiceStatus==='REPLIED') )

  const outstandingInvoices = invoicesArray.filter( invoice => (invoice.status==='UNPAID') )

  setOrderNotification(repliedOrders.length)
  setInvoiceNotification(outstandingInvoices.length)


},[ordersArray, invoicesArray])

  const handleLogOut = () => {
    setUser(null)

  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (

    <Router>

    <Switch >

    <Route
            exact
            path="/"
            render={props => {
              if (user) {

                forceUpdate(!update)
                return <Redirect to="/app/dashboard" />;
              }

              return <Login getUser={getUser} {...props} />;
              
            }}
    />

    <Route path="/app" >

    <div className={classes.root}>
      
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>

          </Typography>
          <IconButton color="inherit">
            
              {/* <NotificationsIcon /> */}
              <img src='https://www.ntdingredientes.com.jm/wp-content/uploads/2019/10/NTD-Ingredientes_Logoblanco150px.png' style={{width: 100 + 'px'}}></img>

          </IconButton>
        </Toolbar>
      </AppBar>

            <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
    
            <div>
              <LinkRoute onClick={() => forceUpdate(!update)} style={{ textDecoration: 'none', color: 'black' }} to="/app/dashboard">
                <ListItem button>
                  <ListItemIcon>
                  <Badge badgeContent={0} color="secondary">
                      <DashboardIcon />
                </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </LinkRoute>
              
              <LinkRoute onClick={() => forceUpdate(!update)} style={{ textDecoration: 'none', color: 'black' }} to="/app/neworder">
                <ListItem button>
                  <ListItemIcon>
    
                      <ShoppingCartIcon />
    
                  </ListItemIcon>
                  <ListItemText primary="New Order" />
                </ListItem>
              </LinkRoute>
              
              <LinkRoute onClick={() => forceUpdate(!update)} style={{ textDecoration: 'none', color: 'black' }} to="/app/vieworders">
                <ListItem button>
                  <ListItemIcon>
                  <Badge badgeContent={orderNotification} color="secondary">
                      <NotesIcon />
                      </Badge>
                  </ListItemIcon>
                  <ListItemText primary="View Orders" />
                </ListItem>
              </LinkRoute>
    
              <LinkRoute onClick={() => forceUpdate(!update)} style={{ textDecoration: 'none', color: 'black' }} to="/app/viewinvoices">
                <ListItem button>
                  <ListItemIcon>
                    <Badge badgeContent={invoiceNotification} color="secondary">
                      <LayersIcon />
                      </Badge>
                  </ListItemIcon>
                  <ListItemText primary="View Invoices" />
                </ListItem>
              </LinkRoute>
            </div>
    
            </List>
            <Divider />

            <LinkRoute onClick={() => handleLogOut()} style={{ textDecoration: 'none', color: 'black' }} to="/">
                <ListItem button>
                  <ListItemIcon>
                    
                      <ExitToAppIcon />

                  </ListItemIcon>
                  <ListItemText primary="Log Out" />
                </ListItem>
              </LinkRoute>
            
          </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

      <Container disableGutters>

        <Switch>

          <Route path="/app/dashboard">

            <Dashboard ordersArray={ordersArray} invoicesArray={invoicesArray} userName={ user && (user.userName)}  />

          </Route>
          <Route path="/app/neworder">
            <div style={{width: 100 +'%', textAlign: 'center'}}><h1 style={{marginBottom: 3+'vh'}}>New Order</h1></div>

            <NewOrder user={user && (user)}  invoicesArray={invoicesArray} updateValue={update} update={forceUpdate} />  

          </Route>
          <Route path="/app/vieworders">
          <div style={{width: 100 +'%', textAlign: 'center'}}><h1 style={{marginBottom: 3+'vh'}}>View Orders</h1></div>

            <ViewOrders updateValue={update} update={forceUpdate} ordersArray={ordersArray}  />
          </Route>
          <Route path="/app/viewinvoices">
          <div style={{width: 100 +'%', textAlign: 'center'}}><h1 style={{marginBottom: 3+'vh'}}>View Invoices</h1></div>

            <ViewInvoices invoicesArray={invoicesArray} />
          </Route>
          <Route path="/app/submitsuccess">
            <SubmitSuccess />
          </Route>
        </Switch>
      </Container>

        <Box pt={4}>
          <Copyright />
        </Box>

      </main>

    </div>

    </Route >

    </Switch >
    </Router>
  );
}

export default App