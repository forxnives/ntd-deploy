import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Title from './Title';
import Typography from '@material-ui/core/Typography';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export default function DashCell({ name }) {
  const theme = useTheme();

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