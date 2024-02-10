import { AppBar, Container, MenuItem, Select, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { CryptoState } from '../../CryptoContext'
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const Header = () => {

  const {currency, setCurrency} = CryptoState();

  return (
    <AppBar color='transparent' position="static">
      <Container>
        <Toolbar style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <Link to='/'><Typography style={{
            fontSize: 30,
            fontWeight: 500,
            fontFamily: 'Poppins',
            display: 'flex',
            alignItems: 'center',
          }}><TrackChangesIcon style={{fontSize: 50}}/>CoinView</Typography></Link>
          <Select
            variant='outlined'
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{
              width: 100,
              height: 40,
              marginRight: 15,
            }}>
            <MenuItem value={'USD'}>USD</MenuItem>
            <MenuItem value={'INR'}>INR</MenuItem>
          </Select>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header