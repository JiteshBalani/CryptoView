import React from 'react'
import { styled } from '@mui/system';
import Carousel from './Carousel';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';



const BannerContainer = styled('div')({
    color: 'white',
    backgroundImage: `url(./banner.jpg)`,
    backgroundSize: 'cover',
    // backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
})

const BannerContent = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '25',
    height: '400'
});

const CoinView = styled('div')({
    fontWeight: '600',
    fontFamily: 'Montserrat',
    fontSize: '50px',
    display: 'flex',
    alignItems: 'center',
});

const TagLine = styled('div')({
    fontFamily: 'Montserrat',
    fontSize: '15px',
    fontWeight: '600',
    color: '#8A92B2',
    textAlign: 'center',
});

const Banner = () => {
    return (
        <BannerContainer>
            <BannerContent>
                <CoinView>
                    <TrackChangesIcon style={{ fontSize: '50px' }} />
                    CoinView
                </CoinView>
                <TagLine>
                    Stay on top of the crypto game with ease.
                </TagLine>
            </BannerContent>
            <Carousel />


        </BannerContainer>
    )
}

export default Banner