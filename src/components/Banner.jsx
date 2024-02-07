import React from 'react'
import { styled } from '@mui/system';
import Carousel from './Carousel';


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
    fontWeight: '500',
    fontFamily: 'Montserrat',
    color: 'blueviolet',
    fontSize: '70px',
});

const TagLine = styled('div')({
    fontFamily: 'Montserrat',
    fontSize: '16px',
});

const Banner = () => {
    return (
            <BannerContainer>
                <BannerContent>
                    <CoinView>
                        CoinView
                    </CoinView>
                    <TagLine>
                    Stay on top of the crypto game with ease.
                    </TagLine>
                </BannerContent>
      <Carousel/>


            </BannerContainer>
    )
}

export default Banner