import React, { Fragment, useEffect, useState } from "react";
import { Box, VStack, Text, Avatar, Button, HStack, Float, FileUpload, useFileUploadContext } from '@chakra-ui/react';
import CookbookBackgroundLarge from './comp/style/img/CookbookBackground1.png';
import { useNavigate } from 'react-router-dom';
import { LuFileImage, LuX } from "react-icons/lu"

import Logo from './comp/Logo';


function Account() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
            const token = sessionStorage.getItem('token');
            const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

            // Redirect to login if no token is found
            if (!token) {
                navigate('/login');
                return;
            }
    
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
        }, [navigate]);

        // Helper function to convert Base64 to a data URI
        const getProfileImageSrc = () => {
            if (user?.profile_image) {
                return `data:image/jpeg;base64,${user.profile_image}`;
            }
            return ''; // Fallback if no profile image is available
        };

        const handleImageChange = (e) => {
            setImage(e.target.files[0]);
        };

        const FileUploadList = () => {
            const fileUpload = useFileUploadContext()
            const files = fileUpload.acceptedFiles
            if (files.length === 0) return null
            return (
              <FileUpload.ItemGroup>
                {files.map((file) => (
                  <FileUpload.Item
                    w="auto"
                    boxSize="20"
                    p="2"
                    file={file}
                    key={file.name}
                  >
                    <FileUpload.ItemPreviewImage />
                    <Float placement="top-end">
                      <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                        <LuX />
                      </FileUpload.ItemDeleteTrigger>
                    </Float>
                  </FileUpload.Item>
                ))}
              </FileUpload.ItemGroup>
            )
          }

        const handleSubmit = (e) => {
            e.preventDefault();

            const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

            // Create FormData to send the data, including the image
            const formData = new FormData();
            formData.append("profileImage", image); // Append the image file

            fetch(`http://${path}/api/user/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to update profile");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Profile updated successfully:', data);
                    alert('Profile updated successfully!');
                })
                .catch(error => console.error('Error updating profile:', error));
        };

    return (
        <Fragment>
            <style>{`
                html, body {
                    height: 100%;
                    margin: 0;
                    background-image: url(${CookbookBackgroundLarge});
                    background-attachment: fixed;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            `}</style>
            <Box
                minHeight="100vh"
                width="100%"
                position="relative"
                bg="transparent"
            >
                <Box
                    position="absolute"
                    top="20px"
                    left="50%"
                    transform="translateX(-50%)"
                    p={4}
                    borderRadius="md"
                >
                    <Logo />
                </Box>
                <form onSubmit={handleSubmit}>
                    <Box
                        position="relative"
                        top="200px"
                        left="50%"
                        transform="translateX(-50%)"
                        width={{ base: "90%", md: "80%" }}
                        bg="whiteAlpha.700"
                        borderRadius="md"
                        pb={4}
                    >
                        <VStack spacing={4}>
                            <Box width="100%" px={8}>
                                <HStack>
                                    <Text fontSize={{ base: "lg", md: "xl" }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" mt="1.0em" fontFamily="'Baloo 2', bold">Username:</Text>
                                    <Text fontSize={{ base: "lg", md: "xl" }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" mt="1.0em" fontFamily="'Baloo 2', bold">{user ? user.username : "Loading..."}</Text>
                                </HStack>
                            </Box>
                            <Box width="100%" px={8}>
                                <Text fontSize={{ base: "lg", md: "xl" }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100%" mt="1.0em" fontFamily="'Baloo 2', bold">Profile Picture:</Text>
                            </Box>
                            <Box width="100%" px={8}>
                                <Avatar.Root size="2xl">
                                    <Avatar.Fallback />
                                    <Avatar.Image src={getProfileImageSrc()} />
                                </Avatar.Root>
                            </Box>
                            <Box width="100%" px={8}>
                            <FileUpload.Root accept="image/*" onChange={handleImageChange}>
                                <FileUpload.HiddenInput />
                                <FileUpload.Trigger asChild>
                                    <Button variant="outline" size="sm">
                                    <LuFileImage /> Upload Image
                                    </Button>
                                </FileUpload.Trigger>
                                <FileUploadList />
                            </FileUpload.Root>
                            </Box>
                        </VStack>
                        <Box width="100%" mt={4} px={8}> 
                            <Button 
                                type="submit" 
                                bg="#FFE47A" // light yellow
                                color="#3B2F1C" // dark brown text
                                border="2px solid #3B2F1C"
                                borderRadius="20px"
                                px={6}
                                py={5}
                                _hover={{
                                    cursor: 'pointer',
                                    bg: '#FFB347', // soft orange
                                }}
                                _active={{
                                    bg: '#FFA733',
                                }}
                                shadow="md"
                                display="flex"
                                justifyContent="center"
                                p={{ base: 1, md: 2 }}
                                mb={3}
                                width="100%"
                                fontFamily="'Baloo 2', bold"
                            > 
                                Update Profile
                            </Button>
                        </Box>
                    </Box>
                </form>
                
            </Box>
        </Fragment>
    );
}

export default Account;
