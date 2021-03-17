import React from 'react';
import Typography from '@material-ui/core/Typography';



export default function DashCell({ name }) {
  
  return (
    <React.Fragment>
      <div style={{backgroundImage: 'url(http://www.ntdingredientes.com.jm/wp-content/uploads/2019/10/quienes_somos2.jpg)', height: 100 + '%', backgroundSize: 'cover'}}>

        <div style={{backgroundColor: 'rgba(255,255,255,.5)' }}>
      
        <Typography component="h2" variant="h4" color="primary" gutterBottom>
          Welcome {`${name}`}
        </Typography>

        </div>

      </div>

    </React.Fragment>
  );
}