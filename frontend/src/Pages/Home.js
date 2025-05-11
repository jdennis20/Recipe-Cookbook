import React, { Fragment, useEffect } from "react";
import { Box, Text, Icon, HStack } from '@chakra-ui/react';
import CookbookBackgroundLarge from './comp/style/img/CookbookBackground.png';
import { useNavigate } from 'react-router-dom';

import Logo from './comp/Logo';
import AccountIcon from './comp/AccountIcon';

import { FaPlus } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";

function Home() {

    const navigate = useNavigate();

    useEffect(() => {

        const token = sessionStorage.getItem('token');

        // Redirect to login if no token is found
        if (!token) {
            navigate('/login');
            return;
        }

    }, [navigate]);

    const handleAdd = () => {
        navigate('/add');
    };

    const handleMy = () => {
        navigate('/my');
    };

    const handleSearch = () => {
        navigate('/search')
    };

    const handleCategory = () => {
        navigate('/category')
    };

    const handleMealPlan = () => {
        navigate('/mealplan')
    }

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

                <Box
                    position="absolute"
                    top="20px"
                    right="20px"
                    p={4}
                >
                    <AccountIcon />
                </Box>

                <Box
                    position="relative"
                    top="200px"
                    ml={{ base: "5%", md: "10%" }}
                    width={{ base: "90%", md: "50%" }}
                >
                    <Box
                        onClick={handleAdd}
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
                        justifyContent="flex-start"
                        p={{ base: 1, md: 2 }}
                        mb={3}
                    >
                        <HStack width="100%" justifyContent="space-between">
                            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" color="black" mt="1.0em">Add Recipe</Text>
                            <Icon color="black" boxSize={{ base: 6, md: 8 }} mr={{ base: 2, md: 3 }}>
                                <FaPlus />
                            </Icon>
                        </HStack>
                    </Box>

                    <Box
                        onClick={handleMy}
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
                        justifyContent="flex-start"
                        p={{ base: 1, md: 2 }}
                        mb={3}
                    >
                        <HStack width="100%" justifyContent="space-between">
                            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" color="black" mt="1.0em">My Recipes</Text>
                            <Icon color="black" boxSize={{ base: 6, md: 8 }} mr={{ base: 2, md: 3 }}>
                                <FaBookOpen />
                            </Icon>
                        </HStack>
                    </Box>

                    <Box
                        onClick={handleSearch}
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
                        justifyContent="flex-start"
                        p={{ base: 1, md: 2 }}
                        mb={3}
                    >
                        <HStack width="100%" justifyContent="space-between">
                            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" color="black" mt="1.0em">Search</Text>
                            <Icon color="black" boxSize={{ base: 6, md: 8 }} mr={{ base: 2, md: 3 }}>
                                <FaSearch />
                            </Icon>
                        </HStack>
                    </Box>
                    <Box
                        onClick={handleCategory}
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
                        justifyContent="flex-start"
                        p={{ base: 1, md: 2 }}
                        mb={3}
                    >
                        <HStack width="100%" justifyContent="space-between">
                            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" color="black" mt="1.0em">Category</Text>
                            <Icon color="black" boxSize={{ base: 6, md: 8 }} mr={{ base: 2, md: 3 }}>
                                <FaTag />
                            </Icon>
                        </HStack>
                    </Box>
                    <Box
                        onClick={handleMealPlan}
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
                        justifyContent="flex-start"
                        p={{ base: 1, md: 2 }}
                        mb={3}
                    >
                        <HStack width="100%" justifyContent="space-between">
                            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" color="black" mt="1.0em">Meal Plan</Text>
                            <Icon color="black" boxSize={{ base: 6, md: 8 }} mr={{ base: 2, md: 3 }}>
                                <GiMeal />
                            </Icon>
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </Fragment>
    );
}

export default Home;
