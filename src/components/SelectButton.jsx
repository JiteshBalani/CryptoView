import { styled } from '@mui/material'
import React from 'react'

const SelectButton = ({ children, selected, onClick }) => {

    const ButtonStyles = styled('span')({
        border: "1px solid deeppink",
        borderRadius: 5,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: "Montserrat",
        cursor: "pointer",
        backgroundColor: selected ? "deeppink" : "",
        color: selected ? "black" : "",
        fontWeight: selected ? 700 : 500,
        "&:hover": {
            backgroundColor: "lightpink",
            color: "black",
        },
        width: "22%",
        textAlign: "center",
    });

    return (
        <ButtonStyles onClick={onClick}>
            {children}
        </ButtonStyles>
    )
}

export default SelectButton