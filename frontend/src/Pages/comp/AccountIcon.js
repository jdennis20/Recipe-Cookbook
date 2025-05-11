import React, { Fragment, useEffect, useState } from "react";
import { Box, Avatar } from '@chakra-ui/react';

function AccountIcon() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        fetch(`http://${path}/api/user`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get user");
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
                console.log('User data:', data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, []);

    function handleClick() {
        window.location.href = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/account`; // Redirect to account page
    }

    // Helper function to convert Base64 to a data URI
    const getProfileImageSrc = () => {
        if (user?.profile_image) {
            return `data:image/jpeg;base64,${user.profile_image}`;
        }
        return ''; // Fallback if no profile image is available
    };

    return (
        <Fragment>
            <Box 
                onClick={handleClick}
                cursor="pointer"
            > 
                <Avatar.Root size="2xl">
                    <Avatar.Fallback />
                    <Avatar.Image src={getProfileImageSrc()} />
                </Avatar.Root>
            </Box>
        </Fragment>
    );
}

export default AccountIcon;