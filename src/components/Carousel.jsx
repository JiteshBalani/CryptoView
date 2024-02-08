import { styled } from '@mui/system'
import axios from 'axios';
import React from 'react'
import { TrendingCoins } from '../utils/api';
import { CryptoState } from '../../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';
import { Container } from '@mui/material';

const CarouselBox = styled('div')({
  height: '50%',
  display: 'flex',
  alignItems: 'center',
});

const CarouselItem = styled('div')({
  paddingTop: '35px',
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  textTransform: "uppercase",
  color: "white",
});



const Carousel = () => {
  const [trending, setTrending] = React.useState([]);

  const { currency, symbol } = CryptoState();

  const carouselData = async () => {
    const { data } = await axios.get(TrendingCoins(currency));
    console.log(data);
    setTrending(data);
  };

  React.useEffect(() => {
    carouselData();
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;
  
    return (
      <Link to={`/coins/${coin.id}`} key={coin.id}>
        <CarouselItem>
          <img src={coin?.image} alt={coin.name} height="80" style={{ marginBottom: 10 }} />
          <span>
            {coin?.symbol}
            &nbsp;
            <span style={{ color: profit > 0 ? "rgb(14, 203, 129)" : "red", fontWeight: 500 }}>
              {profit && "+"}
              {coin?.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </span>
          <span style={{ fontSize: 22, fontWeight: 500 }}>
            {symbol}
            {coin?.current_price.toLocaleString()}
          </span>
        </CarouselItem>
      </Link>
    )
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <Container><CarouselBox>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </CarouselBox>
    </Container>
  )
}

export default Carousel