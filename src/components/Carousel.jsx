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

// Cache object to store trending coins data
const trendingCache = {
  data: null,
  timestamp: null,
  currency: null
};

// Time in milliseconds to refresh cache (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

const Carousel = () => {
  const [trending, setTrending] = React.useState([]);

  const { currency, symbol } = CryptoState();

  const fetchTrendingData = React.useCallback(async () => {
    const currentTime = Date.now();
    const shouldUseCache = 
      trendingCache.data && 
      trendingCache.currency === currency && 
      trendingCache.timestamp && 
      (currentTime - trendingCache.timestamp < CACHE_DURATION);
    
    if (shouldUseCache) {
      console.log("Using cached trending data");
      setTrending(trendingCache.data);
      return;
    }
    
    try {
      console.log("Fetching fresh trending data from API");
      const { data } = await axios.get(TrendingCoins(currency));
      
      // Update the cache
      trendingCache.data = data;
      trendingCache.timestamp = currentTime;
      trendingCache.currency = currency;
      
      setTrending(data);
    } catch (error) {
      console.error("Error fetching trending coins:", error);
      // If there's an error but we have cached data, use it even if it's old
      if (trendingCache.data) {
        setTrending(trendingCache.data);
      }
    }
  }, [currency]);

  React.useEffect(() => {
    fetchTrendingData();
    
    // Optional: Set up a timer to refresh data periodically
    const intervalId = setInterval(() => {
      // Only refresh if the data is stale
      if (Date.now() - trendingCache.timestamp >= CACHE_DURATION) {
        fetchTrendingData();
      }
    }, CACHE_DURATION);
    
    return () => clearInterval(intervalId);
  }, [currency, fetchTrendingData]);

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