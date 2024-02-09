import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, LinearProgress } from '@mui/material'
import React from 'react'
import { CryptoState } from '../../CryptoContext';
import axios from 'axios';
import { CoinList } from '../utils/api';
import { Link } from 'react-router-dom';

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {
    const [coinTable, setCoinTable] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const { currency, symbol } = CryptoState();

    const fetchCoinTable = async () => {
        setLoading(true);
        const data = await axios.get(CoinList(currency));
        setCoinTable(data.data);
        setLoading(false);
    };

    React.useEffect(() => {
        fetchCoinTable()
    }, [currency]);


    return (
        <>
            <TextField id="outlined-basic" label="Search for a Coin" fullWidth variant="outlined" onChange={(e) => setSearch(e.target.value)} />

            <TableContainer style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {loading ? (<LinearProgress style={{ backgroundColor: 'lightpink', }} />) :
                    <Table>
                        <TableHead style={{ backgroundColor: 'deeppink' }}>
                            <TableRow>
                                <TableCell style={{ fontSize: '15px', color: 'white', fontWeight: 'bold' }}>Coins</TableCell>
                                <TableCell style={{ fontSize: '15px', color: 'white', fontWeight: 'bold' }}>{symbol} Price</TableCell>
                                <TableCell align='center' style={{ fontSize: '15px', color: 'white', fontWeight: 'bold' }}>24 Hours Change(%)</TableCell>
                                <TableCell align='right' style={{ fontSize: '15px', color: 'white', fontWeight: 'bold' }}>{symbol} Market Cap</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {coinTable.map((coin) => {
                                let profit = coin?.price_change_percentage_24h >= 0;

                                return (
                                    <TableRow key={coin?.id}>
                                        <TableCell style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                            <img src={coin?.image} style={{ width: '50px', height: '50px', marginRight: '15px' }} alt={coin.name} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ fontSize: '22px' }}>{coin?.symbol.toUpperCase()}</div>
                                                <div>{coin?.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{symbol}&nbsp;{numberWithCommas(coin?.current_price.toFixed(2))}</TableCell>
                                        <TableCell align='center' style={{ color: profit > 0 ? "rgb(14, 203, 129)" : "red" }}>
                                            {profit && "+"}
                                            {coin?.price_change_percentage_24h?.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align='right'>{numberWithCommas(coin?.market_cap.toString().slice(0, -6))}M</TableCell>
                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                }

            </TableContainer>
        </>
    )
}

export default CoinsTable