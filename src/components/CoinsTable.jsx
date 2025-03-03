import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  LinearProgress,
  Pagination,
  createTheme,
  ThemeProvider,
  Paper,
} from "@mui/material";
import React from "react";
import { CryptoState } from "../../CryptoContext";
import axios from "axios";
import { CoinList } from "../utils/api";
import { useNavigate } from "react-router-dom";

export const numberWithCommas = (x) => {
  if (x === null || x === undefined) {
    return "N/A"; // or any other default value or behavior you prefer
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Cache object to store API responses
const apiCache = {
  data: null,
  timestamp: null,
  currency: null,
};

// Time in milliseconds to refresh cache (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

const CoinsTable = () => {
  const [coinTable, setCoinTable] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const { currency, symbol } = CryptoState();

  const fetchCoinTable = React.useCallback(async () => {
    setLoading(true);

    const currentTime = Date.now();
    const shouldUseCache =
      apiCache.data &&
      apiCache.currency === currency &&
      apiCache.timestamp &&
      currentTime - apiCache.timestamp < CACHE_DURATION;

    if (shouldUseCache) {
      console.log("Using cached data");
      setCoinTable(apiCache.data);
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching fresh data from API");
      const response = await axios.get(CoinList(currency));
      const data = response.data;

      // Update the cache
      apiCache.data = data;
      apiCache.timestamp = currentTime;
      apiCache.currency = currency;

      setCoinTable(data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
      // If there's an error but we have cached data, use it even if it's old
      if (apiCache.data) {
        setCoinTable(apiCache.data);
      }
    } finally {
      setLoading(false);
    }
  }, [currency]);

  React.useEffect(() => {
    fetchCoinTable();

    // Optional: Set up a timer to refresh data periodically
    const intervalId = setInterval(() => {
      // Only refresh if the data is stale
      if (Date.now() - apiCache.timestamp >= CACHE_DURATION) {
        fetchCoinTable();
      }
    }, CACHE_DURATION);

    return () => clearInterval(intervalId);
  }, [currency, fetchCoinTable]);

  const navigate = useNavigate();

  const handleSearch = () => {
    return coinTable.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search for a Coin"
        fullWidth
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer
        component={Paper}
        sx={{ marginTop: "1rem", marginBottom: "1rem" }}
      >
        {loading ? (
          <LinearProgress sx={{ backgroundColor: "lightpink" }} />
        ) : (
          <Table aria-label="simple table">
            <TableHead style={{ backgroundColor: "deeppink" }}>
              <TableRow>
                {["Coins", "Price", "24H %Change", "Market Cap"].map((head) => (
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "700",
                      fontFamily: "Montserrat",
                    }}
                    key={head}
                    align={head === "Coins" ? "" : "right"}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch()
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map((coin) => {
                  const profit = coin?.price_change_percentage_24h > 0;
                  return (
                    <TableRow
                      key={coin.id}
                      sx={{
                        backgroundColor: "#16171a",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#131111",
                        },
                        fontFamily: "Montserrat",
                      }}
                      onClick={() => navigate(`/coins/${coin.id}`)}
                    >
                      <TableCell
                        component="th"
                        scope="coin"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 15,
                        }}
                      >
                        <img
                          src={coin?.image}
                          alt={coin?.name}
                          width="50"
                          height="50"
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              textTransform: "uppercase",
                              fontSize: 22,
                            }}
                          >
                            {coin?.symbol}
                          </span>
                          <span style={{ color: "darkgrey" }}>
                            {coin?.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(coin?.current_price.toFixed(2))}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          color: profit > 0 ? "rgb(14,203,129)" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {profit && "+"}
                        {coin?.price_change_percentage_24h?.toFixed(2)}%
                      </TableCell>

                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(
                          coin?.market_cap?.toString().slice(0, -6)
                        )}
                        M
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Pagination
        color="secondary"
        variant="outlined"
        size="medium"
        sx={{
          display: "flex",
          justifyContent: "center",
          // padding: 20,
          paddingTop: 5,
          paddingBottom: 5,
          width: "100%",
        }}
        count={(handleSearch()?.length / 10).toFixed(0)}
        onChange={(_, value) => {
          setPage(value);
          window.scroll(0, 450);
        }}
      />
    </>
  );
};

export default CoinsTable;
