import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link as LinkRoute,
    withRouter 
  } from "react-router-dom";

function Title({history}) {

    setTimeout(()=>history.push('/app/dashboard'), 2000);

  return (
    <div>
      <div style={{width: 100 +'%', textAlign: 'center'}}><h1 style={{marginBottom: 3+'vh'}}>Successfully  Submitted</h1></div>
        
    </div>
  );    
}

Title.propTypes = {
  children: PropTypes.node,
};

export default withRouter(Title);