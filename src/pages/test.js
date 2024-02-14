import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/system";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { CryptoState } from "../Cryptocontext";
import { styled } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import { SelectButton } from "./SelectButton";
import 'chart.js/auto';

const CoinInfo = ({ coin }) => {
  const ref = useRef();
  const HistoricalChart = (id, days = 365, currency) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
  const [historicData, setHistoricData] = useState();
  const [flag, setflag] = useState(false);
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const fetHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setflag(true);
    setHistoricData(data.prices);
  };
  useEffect(() => {
    fetHistoricData();
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#ffffff",
      },
      mode: "dark",
    },
  });
  const Container = styled("div")(({ theme }) => ({
    display: "flex",
    width: "75%",
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
  const chartDays = [
    {
      label: "24 Hours",
      value: 1,
    },
    {
      label: "30 Days",
      value: 30,
    },
    {
      label: "3 Months",
      value: 90,
    },
    {
      label: "1 Year",
      value: 365,
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        {!historicData | (flag == false) ? (
          <CircularProgress
            sx={{ color: "#6a11cb" }}
            size={200}
            thickness={1}
          />
        ) : (
          <>
            <Line ref={ref}
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()}PM`
                      : `${date.getHours()}:${date.getMinutes()}AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `price (Past ${days} Days) in ${currency}`,
                    borderColor: "#43e97b",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
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
                    setflag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CoinInfo;
