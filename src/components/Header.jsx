import React from 'react'
import { AppBar, Container, MenuItem, Select, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Header = () => {
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
            fontFamily: 'montserrat'
          }}>CryptoView</Typography></Link>
          <Select
            variant='outlined'
            value={'USD'}
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