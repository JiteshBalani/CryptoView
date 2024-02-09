import React from 'react'
import Banner from '../components/Banner'
import { Container, TextField, styled } from '@mui/material'
import CoinsTable from '../components/CoinsTable';

const Homepage = () => {

  const Heading = styled('div')({
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight:'400',
    marginTop: '1rem',
    marginBottom: '1rem',
    fontFamily: 'Montserrat'
  });

  return (
    <>
      <Banner/>
      <Container>
        <Heading>Cryptocurrency Prices by Market Cap</Heading>
        <CoinsTable/>
      </Container>
    </>
  )
}

export default Homepage