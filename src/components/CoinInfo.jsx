import React, { useEffect, useState, useCallback } from 'react'
import { CryptoState } from '../../CryptoContext';
import { CircularProgress, ThemeProvider, createTheme, styled } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { HistoricalChart } from '../utils/api';
import axios from 'axios';
import { chartDays } from '../utils/data';
import SelectButton from './SelectButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Cache object to store historical chart data
const historicalDataCache = {};

// Time in milliseconds to refresh cache (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [days, setDays] = useState(1);
  const [flag, setFlag] = useState(false);
  const { currency, symbol } = CryptoState();

  const ChartContainer = styled('div')(({ theme }) => ({
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  }));

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

  // Generate a cache key based on the parameters
  const getCacheKey = useCallback((coinId, daysParam, currencyParam) => {
    return `${coinId}_${daysParam}_${currencyParam}`;
  }, []);

  const fetchChartData = useCallback(async () => {
    if (!coin?.id) return;
    
    setFlag(false);
    const cacheKey = getCacheKey(coin.id, days, currency);
    const currentTime = Date.now();
    
    // Check if we have valid cached data
    if (
      historicalDataCache[cacheKey] && 
      historicalDataCache[cacheKey].timestamp && 
      (currentTime - historicalDataCache[cacheKey].timestamp < CACHE_DURATION)
    ) {
      console.log("Using cached historical data for", coin.id, days, currency);
      setHistoricalData(historicalDataCache[cacheKey].data);
      setFlag(true);
      return;
    }
    
    try {
      console.log("Fetching fresh historical data for", coin.id, days, currency);
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      
      // Update the cache
      historicalDataCache[cacheKey] = {
        data: data.prices,
        timestamp: currentTime
      };
      
      setHistoricalData(data.prices);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      // If there's an error but we have cached data, use it even if it's old
      if (historicalDataCache[cacheKey]) {
        setHistoricalData(historicalDataCache[cacheKey].data);
      }
    } finally {
      setFlag(true);
    }
  }, [coin?.id, days, currency, getCacheKey]);

  useEffect(() => {
    fetchChartData();
    
    // Clean up function to prevent setting state on unmounted component
    return () => {
      // No cleanup needed for the cache itself as we want to persist it
    };
  }, [fetchChartData]);

  // Cleanup old cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const currentTime = Date.now();
      
      // Clean up cache entries older than CACHE_DURATION
      Object.keys(historicalDataCache).forEach(key => {
        if (currentTime - historicalDataCache[key].timestamp > CACHE_DURATION) {
          delete historicalDataCache[key];
        }
      });
    }, CACHE_DURATION);
    
    return () => clearInterval(cleanupInterval);
  }, []);

  const myData = {
    labels: historicalData.map((coin) => {
      const date = new Date(coin[0]);
      const time =
        date.getHours() > 12
          ? `${date.getHours() - 12}:${date.getMinutes()}PM`
          : `${date.getHours()}:${date.getMinutes()}AM`;
      return days === 1 ? time : date.toLocaleDateString();
    }),
    datasets: [
      {
        data: historicalData.map((coin) => coin[1]),
        label: ` Price in Past Days ${days} in ${currency} `,
        borderColor: 'burlywood',
      }
    ]
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <ChartContainer>
        {!historicalData || flag === false ? (
          <CircularProgress
            style={{ color: "deeppink" }}
            size={250}
            thickness={1} />
        ) : (
          <>
            <Line data={myData}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  }
                }
              }} />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </ChartContainer>
    </ThemeProvider>
  );
};

export default CoinInfo;