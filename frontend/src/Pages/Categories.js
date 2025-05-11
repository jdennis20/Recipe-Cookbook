import { Fragment, useState, useEffect } from "react";
import { Box, Grid, GridItem, HoverCard, Image, Portal, Strong, Text } from '@chakra-ui/react';
import CookbookBackgroundLarge from "./comp/style/img/CookbookBackground1.png";
import Logo from "./comp/Logo";
import AccountIcon from "./comp/AccountIcon";
import { useNavigate } from 'react-router-dom';

import BreakfastImg from "./comp/style/img/minimalcartoonbrea.png";
import LunchImg from "./comp/style/img/minimalcartoonlunc.png";
import DinnerImg from "./comp/style/img/minimalcartoonstea.png";
import DessertImg from "./comp/style/img/minimalcartoondess.png";
import HealthyImg from "./comp/style/img/minimalcartoonheal.png";
import ItalianImg from "./comp/style/img/minimalcartoonItal.png";
import MexicanImg from "./comp/style/img/minimalcartoonMexi.png";
import AsianImg from "./comp/style/img/minimalcartoonAsia.png";
import AmericanImg from "./comp/style/img/minimalcartoonAmer.png";

function Categories() {
    const [openBreakfast, setOpenBreakfast] = useState(false)
    const [openLunch, setOpenLunch] = useState(false)
    const [openDinner, setOpenDinner] = useState(false)
    const [openDessert, setOpenDessert] = useState(false)
    const [openHealthy, setOpenHealthy] = useState(false)
    const [openItalian, setOpenItalian] = useState(false)
    const [openMexican, setOpenMexican] = useState(false)
    const [openAmerican, setOpenAmerican] = useState(false)
    const [openAsian, setOpenAsian] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the token from localStorage
        const token = sessionStorage.getItem('token');

        // Redirect to login if no token is found
        if (!token) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    const handleCategroy = (category) => {
        console.log(category)
        navigate(`/recipe/${category}`);
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
        <Box minHeight="100vh" width="100%" position="relative" bg="transparent" pb="250px">
            <Box position="absolute" top="20px" left="50%" transform="translateX(-50%)" p={4} borderRadius="md">
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
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "90%", md: "80%" }}
                borderRadius="md"
                pb={4}
            >
                <Grid 
                    templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                    gap="6"
                >
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('breakfast')}
                    >
                        <HoverCard.Root open={openBreakfast} onOpenChange={(e) => setOpenBreakfast(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={BreakfastImg} 
                                    alt="Breakfast" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Breakfast
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Breakfast</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('lunch')}
                    >
                        <HoverCard.Root open={openLunch} onOpenChange={(e) => setOpenLunch(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={LunchImg} 
                                    alt="Lunch" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Lunch
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Lunch</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('dinner')}
                    >
                        <HoverCard.Root open={openDinner} onOpenChange={(e) => setOpenDinner(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={DinnerImg} 
                                    alt="Dinner" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Dinner
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Dinner</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('dessert')}
                    >
                        <HoverCard.Root open={openDessert} onOpenChange={(e) => setOpenDessert(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={DessertImg} 
                                    alt="Dessert" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Dessert
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Dessert</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('healthy')}
                    >
                        <HoverCard.Root open={openHealthy} onOpenChange={(e) => setOpenHealthy(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={HealthyImg} 
                                    alt="Healthy" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Healthy
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Healthy</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('italian')}
                    >
                        <HoverCard.Root open={openItalian} onOpenChange={(e) => setOpenItalian(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={ItalianImg} 
                                    alt="Italian" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Italian
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Italian</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('mexican')}
                    >
                        <HoverCard.Root open={openMexican} onOpenChange={(e) => setOpenMexican(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={MexicanImg} 
                                    alt="Mexican" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Mexican
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Mexican</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('american')}
                    >
                        <HoverCard.Root open={openAmerican} onOpenChange={(e) => setOpenAmerican(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={AmericanImg} 
                                    alt="American" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    American
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>American</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                    <GridItem
                        colSpan={1} 
                        mb={4} 
                        borderRadius="md" 
                        _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        onClick={() => handleCategroy('asian')}
                    >
                        <HoverCard.Root open={openAsian} onOpenChange={(e) => setOpenAsian(e.open)}>
                            <HoverCard.Trigger asChild>
                                <Box position="relative">
                                <Image 
                                    src={AsianImg} 
                                    alt="Asian" 
                                    borderRadius="md"
                                    width="100%" 
                                    height="100%" 
                                    objectFit="cover"
                                />
                                <Text 
                                    display={{ base: "block", md: "none" }} 
                                    position="absolute" 
                                    bottom="0" 
                                    width="100%" 
                                    bg="rgba(0, 0, 0, 0.5)" 
                                    color="white" 
                                    textAlign="center"
                                    p={2}
                                    borderBottomRadius="md"
                                >
                                    Asian
                                </Text>
                                </Box>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                <HoverCard.Content maxWidth="240px">
                                    <HoverCard.Arrow />
                                    <Box>
                                    <Strong>Asian</Strong>
                                    </Box>
                                </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    </Fragment>
  );
}

export default Categories;