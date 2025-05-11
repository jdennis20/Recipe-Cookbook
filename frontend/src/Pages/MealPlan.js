import { Fragment, useEffect, useState } from 'react';
import { Box, Card, GridItem, Grid, Icon, Dialog, Input, Textarea, Text, Portal, Button, HStack, Alert, Stack} from '@chakra-ui/react';
import { CloseButton } from "../components/ui/close-button";
import { useNavigate } from 'react-router-dom';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  //DrawerTrigger,
} from "../components/ui/drawer";

import CookbookBackgroundLarge from './comp/style/img/CookbookBackground1.png';

import Logo from './comp/Logo';
import AccountIcon from './comp/AccountIcon';

import { FaPlus } from "react-icons/fa";

function MealPlan() {

    const navigate = useNavigate();

    const [mealPlanName, setMealPlanName] = useState("");
    const [notes, setNotes] = useState("");
    const [mealPlans, setMealPlans] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [mealPlanDetails, setMealPlanDetails] = useState([]);
    const [mealPlanId, setMealPlanId] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [success2, setSuccess2] = useState(false);
    const [error2, setError2] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [refreshMealPlans, setRefreshMealPlans] = useState(false);

    useEffect(() => {

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
    
        const token = sessionStorage.getItem('token');
    
        // Redirect to login if no token is found
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`http://${path}/api/mealplans`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get meal plans");
                }
                return response.json();
            })
            .then(data => {
                const sortedMealPlans = data.sort((a, b) => a.name.localeCompare(b.name));
                setMealPlans(sortedMealPlans);
                console.log('Meal Plans:', data);
            })
            .catch(error => console.error('Error fetching meal plans:', error));
    
    }, [navigate, refreshMealPlans]);

    const handleMealPlanName = (e) => {
        setMealPlanName(e.target.value);
    };

    const handleNotes = (e) => {
        setNotes(e.target.value);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSuccess(false);
        setError(false);

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        const data = {
            mealPlanName: mealPlanName,
            notes: notes,
        };

        try {
            const response = await fetch(`http://${path}/api/mealplan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();

                setMealPlanName("");
                setNotes("");

                setIsDialogOpen(false);

                setRefreshMealPlans(prev => !prev);

                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                console.log("Meal plan created successfully:", result);
            } else {
                const error = await response.json();
                setError(true);
                setTimeout(() => setError(false), 3000);
                console.error("Failed to create meal plan:", error);
            }
        } catch (error) {
            setError(true);
            setTimeout(() => setError(false), 3000);
            console.error("Error:", error);
        }
    };

    const fetchMealPlanDetails = async (mealPlanId) => {
        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        setMealPlanId(mealPlanId);

        try {
            const response = await fetch(`http://${path}/api/mealplandetails/${mealPlanId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const mealPlanDetails = await response.json();
                console.log("Meal plan details:", mealPlanDetails);

                // Extract notes from the first item (assuming it's consistent across all rows)
                const notes = mealPlanDetails.length > 0 ? mealPlanDetails[0].notes : "";

                setMealPlanDetails(mealPlanDetails);
                setNotes(notes);
                setIsDrawerOpen(true);
            } else {
                const error = await response.json();
                console.error("Failed to fetch meal plan details:", error);
            }
        } catch (error) {
            console.error("Error:", error);
        }

    };

    const handleDelete = async () => {
        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        setSuccess2(false);
        setError2(false);

        if (mealPlanId) {
            try {
                const response = await fetch(`http://${path}/api/deletemealplan/${mealPlanId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
    
                if (response.ok) {
                    setMealPlans(mealPlans.filter(mealPlan => mealPlan.meal_plan_id !== mealPlanId));
                    console.log("Meal plan deleted successfully");
                    setIsDrawerOpen(false);
                    setSuccess2(true);
                    setTimeout(() => setSuccess2(false), 3000);
                } else {
                    const error = await response.json();
                    setError2(true);
                    setTimeout(() => setError2(false), 3000);
                    console.error("Failed to delete meal plan:", error);
                }
            } catch (error) {
                setError2(true);
                setTimeout(() => setError2(false), 3000);
                console.error("Error:", error);
            }
        }

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
                pb="250px"
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
                        {mealPlans.map((mealPlan, index) => (
                            <GridItem 
                                key={index} 
                                colSpan={1} 
                                mb={4} 
                                borderRadius="md" 
                                _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                                onClick={() => fetchMealPlanDetails(mealPlan.meal_plan_id)}
                            >
                                <Card.Root
                                    display='flex' 
                                    flexDirection='column' 
                                    height='100%' 
                                    borderRadius='2xl' 
                                    bg="yellow.100"
                                    border="2px solid #5C3B1E"
                                    _hover={{ bg: 'orange.100' }}
                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                    fontWeight="bold"
                                    boxShadow='md'
                                >
                                    <Card.Body display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                                        <Card.Title
                                            style={{
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: '1.5em',
                                                fontFamily: "'Baloo 2', bold",
                                                textAlign: 'center',
                                            }}
                                        >
                                            {mealPlan.name}
                                        </Card.Title>
                                        <Text
                                            fontFamily="'Baloo 2', bold"
                                            textAlign="center"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2, // Limit to 2 lines
                                                overflow: 'hidden', // Hide overflow
                                                textOverflow: 'ellipsis', // Add ellipsis
                                            }}
                                        >
                                            {mealPlan.notes && mealPlan.notes.length > 20
                                            ? `${mealPlan.notes.substring(0, 20)}...`
                                            : mealPlan.notes}
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                            </GridItem>
                        ))}
                        <GridItem
                            colSpan={1} 
                            mb={4} 
                            borderRadius="md" 
                            _hover={{ cursor: 'pointer', boxShadow: 'lg' }}
                        >
                            <Dialog.Root
                                open={isDialogOpen}
                                onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
                                placement="center"
                                motionPreset="slide-in-bottom"
                                size={{ base: 'sm', md: 'lg' }}
                            >
                                <Dialog.Trigger asChild>
                                    <Card.Root
                                        onClick={() => {
                                            setIsDialogOpen(true);
                                            setMealPlanName("");
                                            setNotes("");
                                        }}
                                        display='flex' 
                                        flexDirection='column' 
                                        height='100%' 
                                        borderRadius='2xl' 
                                        bg="yellow.100"
                                        border="2px solid #5C3B1E"
                                        _hover={{ bg: 'orange.100' }}
                                        _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                        fontWeight="bold"
                                        boxShadow='md'
                                    >
                                        <Card.Body display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                                            <Card.Title
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    lineHeight: '1.5em',
                                                    fontFamily: "'Baloo 2', bold",
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Add Meal Plan
                                            </Card.Title>
                                            <Icon color="black" boxSize={{ base: 6, md: 8 }}>
                                                <FaPlus />
                                            </Icon>
                                        </Card.Body>
                                    </Card.Root>
                                </Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                        <Dialog.Content borderRadius="20px">
                                            <form onSubmit={handleSubmit}>
                                            <Dialog.Header>
                                                <Dialog.Title fontFamily="'Baloo 2', bold">
                                                    Add Meal Plan
                                                </Dialog.Title>
                                            </Dialog.Header>
                                            <Dialog.Body pb={8}>
                                                <Input
                                                    placeholder="Meal Plan Name"
                                                    fontFamily="'Baloo 2', bold"
                                                    size="lg"
                                                    mb={4}
                                                    borderColor="gray.300"
                                                    _hover={{ borderColor: 'gray.400' }}
                                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                                    value={mealPlanName}
                                                    onChange={handleMealPlanName}
                                                />
                                                <Text mb={4} fontFamily="'Baloo 2', bold">
                                                    Notes:
                                                </Text>
                                                <Textarea
                                                    placeholder="Add any notes or details about the meal plan here."
                                                    fontFamily="'Baloo 2', bold"
                                                    size="lg"
                                                    borderColor="gray.300"
                                                    _hover={{ borderColor: 'gray.400' }}
                                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                                    value={notes}
                                                    onChange={handleNotes}
                                                />
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <HStack spacing={3}>
                                                    <Button
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
                                                        fontFamily="'Baloo 2', bold"
                                                        type="submit"
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
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
                                                        fontFamily="'Baloo 2', bold"
                                                        onClick={() => {
                                                            setIsDialogOpen(false);
                                                            setMealPlanName("");
                                                            setNotes("");
                                                        }}
                                                    >
                                                        Close
                                                    </Button>
                                                </HStack>
                                            </Dialog.Footer>
                                            </form>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
            <DrawerRoot open={isDrawerOpen} size="sm" onOpenChange={(e) => setIsDrawerOpen(e.open)} style={{ zIndex: 999 }}>
                <DrawerBackdrop />
                <DrawerContent>
                    <DrawerCloseTrigger />
                    <DrawerHeader>
                        <DrawerTitle fontFamily="'Baloo 2', bold" fontSize="2xl">
                            Meal Plan Details
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerBody>
                        {notes && (
                            <Fragment>
                                <Text fontWeight="bold" fontFamily="'Baloo 2', bold" mb={4}>
                                    Notes:
                                </Text>
                                <Text
                                    fontFamily="'Baloo 2', bold"
                                    fontSize="lg"
                                    mb={6}
                                    style={{ whiteSpace: 'pre-wrap' }} // Preserve spaces and newlines
                                >
                                    {notes}
                                </Text>
                            </Fragment>
                        )}

                        {mealPlanDetails && (
                            <Fragment>
                                <Text fontWeight="bold" mt={4} fontFamily="'Baloo 2', bold">
                                    Recipes:
                                </Text>
                                {mealPlanDetails.map((recipe, index) => (
                                    <Text key={recipe.recipe_id} fontFamily="'Baloo 2', bold" fontSize="lg">
                                        {index + 1}: {recipe.recipe_name}
                                    </Text>
                                ))}
                            </Fragment>
                        )}
        
                    </DrawerBody>
                    <DrawerFooter>
                        <HStack spacing={3}>
                        <Button
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
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button
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
                                onClick={() => {
                                    setIsDrawerOpen(false)
                                    setNotes("");
                                }}
                            >
                                Close
                            </Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerRoot>
            <Stack position="fixed" bottom="20px" left="50%" transform="translateX(-50%)" width="90%" maxWidth="400px" spacing={4}>
                {success && (
                    <Alert.Root status="success">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>Meal plan created successfully!</Alert.Description>
                        </Alert.Content>
                            <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {error && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>There was an error creating the meal plan. Please try again later.</Alert.Description>
                        </Alert.Content>
                            <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {success2 && (
                    <Alert.Root status="success">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>Meal plan deleted successfully!</Alert.Description>
                        </Alert.Content>
                            <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {error2 && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>There was an error deleting the meal plan. Please try again later.</Alert.Description>
                        </Alert.Content>
                            <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
            </Stack>
        </Fragment>
    );
}

export default MealPlan;