import React, { Fragment } from "react";
import { Box, Image } from '@chakra-ui/react';
import LogoImg from './style/img/Family_Cookbook_Logo.png'; // Updated to avoid naming conflict

function Logo() {

    function handleClick() {
        window.location.href = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/home`; // Redirect to home page
    }

    return (
        <Fragment>
            <Box 
                onClick={handleClick} // Add click handler
                cursor="pointer" // Change cursor to pointer on hover
            > 
                <Image src={LogoImg} alt="Logo" width="150px" height="auto" />
            </Box>
        </Fragment>
    );
}

export default Logo;
