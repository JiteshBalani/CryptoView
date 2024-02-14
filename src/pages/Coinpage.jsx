import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CryptoState } from '../../CryptoContext';
import axios from 'axios';
import { SingleCoin } from '../utils/api';
import CoinInfo from '../components/CoinInfo';
import { LinearProgress, styled } from '@mui/material';
import { numberWithCommas } from '../components/CoinsTable';
import HTMLReactParser from 'html-react-parser';

const Coinpage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol } = CryptoState();

  const fetchCoinData = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoinData();
  }, [currency]);

  const SidebarComp = styled('div')(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.down("md")]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  }));

  const Sidebar = styled('div')(({ theme }) => ({
    width: '30%',
    [theme.breakpoints.down("md")]: {
      width: '100%',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 25,
    borderRight: '2px solid grey',
  }));

  const Description = styled('div')(({ theme }) => ({
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  }));

  const MarketData = styled('div')(({ theme }) => ({
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-around",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  }));

  if (!coin) return <LinearProgress sx={{ backgroundColor: 'lightpink', }} />;
  return (
    <div>
      <SidebarComp>
        <Sidebar>
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <span style={{
            fontSize: 48,
            fontWeight: "800",
            marginBottom: 20,
          }}>
            {coin?.name}
          </span>
          <Description> {HTMLReactParser(coin?.description.en.split(". ")[0])}.</Description>
          <MarketData>
            <div style={{
              display: "flex",
              width: "100%",
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              marginBottom: 20,
            }}>
              <p>Rank:</p>&nbsp; &nbsp;
              <p style={{ fontWeight: '400' }}>{numberWithCommas(coin?.market_cap_rank)}</p>
            </div>
            <div style={{
              display: "flex",
              width: "100%",
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              marginBottom: 20,
            }}>
              <p>Current Price:</p>&nbsp; &nbsp;
              <p style={{ fontWeight: '400' }}>{symbol} {numberWithCommas(coin?.market_data.current_price[currency?.toLowerCase()])}</p>
            </div>
            <div style={{
              display: "flex",
              width: "100%",
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              marginBottom: 20,
            }}>
              <p>Market Cap:</p>&nbsp; &nbsp;
              <p style={{ fontWeight: '400' }}>{symbol} {numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))}M</p>
            </div>
          </MarketData>
        </Sidebar>

      <CoinInfo coin={coin} />
      </SidebarComp>
      {/* Chart  */}
    </div>
  )
}

export default Coinpage