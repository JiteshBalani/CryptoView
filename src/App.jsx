import './App.css'
import Header from './components/Header';
import Homepage from './pages/Homepage';
import Coinpage from './pages/Coinpage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark', // You can use 'light' or 'dark' mode
      background: {
        default: '#14161A', // Set the default background color here
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path='/' Component={Homepage} />
          <Route path='/coins/:id' Component={Coinpage} />
          <Route errorElement={<ErrorPage/>} />
        </Routes>
      </div>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
