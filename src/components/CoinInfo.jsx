import React, { useEffect, useState } from 'react'
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
    primary:{
      main: '#fff',
    },
    type: 'dark',
  },
  });

  const fetchChartData = async () => {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setFlag(true);
      setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchChartData();
  }, [days, currency]);

  const myData = {
    labels: historicalData.map((coin)=>{
     const date = new Date(coin[0])
     const time = 
     date.getHours() > 12 
     ? `${date.getHours() -12}:${date.getMinutes()}PM` 
     : `${date.getHours()}:${date.getMinutes()}AM`
      return days === 1 ? time : date.toLocaleDateString() 
    }), 
    datasets:[
        {
            data: historicalData.map((coin)=>coin[1]),
            label: ` Price in Past Days ${days} in ${currency} `,
            borderColor: 'purple',
        }
    ]
    
  }
  

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
          elements:{
              point:{
                  radius:1, 
              }
          }
        }}/>
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
                  onClick={() => {setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )
        }
    </ChartContainer>
    </ThemeProvider>
  )
}

export default CoinInfo