import { Fragment, useEffect, useState } from 'react';
import { Box, Input, Text, Button, HStack, Alert, Stack, Spinner, Icon, IconButton, Image, Grid, GridItem, Card, Dialog, Portal, NativeSelect } from '@chakra-ui/react';
import { CloseButton } from "../components/ui/close-button";
import { useNavigate, useParams } from 'react-router-dom';
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
import { FaHeart } from "react-icons/fa";
import CookbookBackgroundLarge from './comp/style/img/CookbookBackground1.png';
import TempImg from "./comp/style/img/CartoonPlate.png";
import Logo from './comp/Logo';
import AccountIcon from './comp/AccountIcon';

function Category() {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFavFilter, setIsFavFilter] = useState(false); // New state variable for favorite filter
    const navigate = useNavigate();
    const { cat } = useParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [success2, setSuccess2] = useState(false);
    const [error2, setError2] = useState(false);
    const [error, setError] = useState(false);
    const [mealPlans, setMealPlans] = useState([]);
    const [mealPlanId, setMealPlanId] = useState('');

    useEffect(() => {
        console.log("Category from URL:", cat); // Log the category from the URL

        // Retrieve the token from localStorage
        const token = sessionStorage.getItem('token');

        // Redirect to login if no token is found
        if (!token) {
            navigate('/login');
            return;
        }

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
        fetch(`http://${path}/api/all`,{
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get recipes");
                }
                return response.json();
            })
            .then(data => {
                console.log("API Data:", data); // Log the full data array
                const filteredRecipes = data.filter(recipe => {
                    if (recipe.categories) {
                        // Normalize categories and cat to lowercase for case-insensitive comparison
                        const categoriesArray = recipe.categories.split(',').map(category => category.trim().toLowerCase());
                        console.log("Normalized Categories Array:", categoriesArray); // Log normalized categories
                        return categoriesArray.includes(cat.toLowerCase()); // Compare in lowercase
                    }
                    return false; // Exclude recipes with null categories
                });
                console.log("Filtered Recipes:", filteredRecipes); // Log the filtered recipes
                const sortedRecipes = filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
                setRecipes(sortedRecipes);
            })
            .catch(error => console.error('Error fetching recipes:', error));

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
    }, [cat, navigate]); //cat is the dependency array and makes sure useEffect runs again if this is updated

    const fetchRecipeDetails = (id) => {
        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        // Retrieve the token from localStorage
        const token = sessionStorage.getItem('token');

        fetch(`http://${path}/api/recipe/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get recipe");
                }
                return response.json();
            })
            .then(data => {
                setSelectedRecipe(data);
                setIsDrawerOpen(true);
            })
            .catch(error => console.error('Error fetching recipe details:', error));
    };

    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!isFavFilter || recipe.is_favorite) // Apply favorite filter if isFavFilter is true
    );

    const handleFavSort = () => {
        setIsFavFilter(!isFavFilter); // Toggle favorite filter
    };

    const handleEditClick = () => {
        if (selectedRecipe) {
            navigate(`/edit-recipe/${selectedRecipe.recipe_id}`);
        }
    };

    const handleDeleteClick = () => {
        setLoading(true);
        setSuccess(false);
        setError(false);
        if (selectedRecipe) {
            const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

            // Retrieve the token from localStorage
            const token = sessionStorage.getItem('token');

            fetch(`http://${path}/api/delete/${selectedRecipe.recipe_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        setError(true);
                        setTimeout(() => setError(false), 3000);
                        throw new Error("Failed to delete recipe");
                    }
                    return response.json();
                })
                .then(data => {
                    setRecipes(recipes.filter(recipe => recipe.recipe_id !== selectedRecipe.recipe_id));
                    setSelectedRecipe(null);
                    setLoading(false);
                    setIsDrawerOpen(false);
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                })
                .catch((error) => {
                    console.error('Error deleting recipe:', error);
                    setLoading(false);
                    setError(true);
                    setTimeout(() => setError(false), 3000);
                });
        }
    };

    const handleAddFavClick = () => {
        if (selectedRecipe) {
            const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
            
            // Retrieve the token from localStorage
            const token = sessionStorage.getItem('token');

            fetch(`http://${path}/api/addfav/${selectedRecipe.recipe_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to favorite recipe");
                    }
                    return response.json();
                })
                .then(data => {
                    setRecipes(recipes.map(recipe => {
                        if (recipe.recipe_id === selectedRecipe.recipe_id) {
                            return { ...recipe, is_favorite: true };
                        }
                        return recipe;
                    }));
                    setSelectedRecipe({ ...selectedRecipe, is_favorite: true });
                })
                .catch(error => console.error('Error updating favorite:', error));
        }
    };
    
    const handleDelFavClick = () => {
        if (selectedRecipe) {
            const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

            // Retrieve the token from localStorage
            const token = sessionStorage.getItem('token');

            fetch(`http://${path}/api/delfav/${selectedRecipe.recipe_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to unfavorite recipe");
                }
                return response.json();
            })
                .then(data => {
                    setRecipes(recipes.map(recipe => {
                        if (recipe.recipe_id === selectedRecipe.recipe_id) {
                            return { ...recipe, is_favorite: false };
                        }
                        return recipe;
                    }));
                    setSelectedRecipe({ ...selectedRecipe, is_favorite: false });
                })
                .catch(error => console.error('Error updating favorite:', error));
        }
    };

    const handleAddMealPlan = (e) => {
            setSuccess2(false);
            setError2(false);
    
            e.preventDefault();
            const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
        
            // Retrieve the token from sessionStorage
            const token = sessionStorage.getItem('token');
    
            console.log('mealPlanID', mealPlanId);
            console.log('recipeId', selectedRecipe.recipe_id);
        
            // Ensure both recipeId and mealPlanId are sent in the body
            fetch(`http://${path}/api/addtomealplan`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json', // Ensure the content type is JSON
                },
                body: JSON.stringify({ recipeId: selectedRecipe.recipe_id, mealPlanId: mealPlanId }),
            })
                .then((response) => {
                    if (!response.ok) {
                        setError2(true);
                        setTimeout(() => setError2(false), 3000);
                        throw new Error("Failed to add recipe to meal plan");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Recipe added to meal plan:', data);
                    setIsDrawerOpen(false); // Close the drawer after success
                    setSuccess2(true);
                    setTimeout(() => setSuccess2(false), 3000);
                })
                .catch((error) => {
                    console.error('Error adding recipe to meal plan:', error)
                    setError2(true);
                    setTimeout(() => setError2(false), 3000);
                });
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
                    <HStack alignItems="center"> {/* Align items to center */}
                        <Input
                            placeholder="Search recipes..."
                            mb={4}
                            fontFamily="'Baloo 2', bold"
                            bg="yellow.100"
                            borderRadius="2xl"
                            border="2px solid #5C3B1E"
                            _hover={{ bg: 'orange.100' }}
                            _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                            fontWeight="bold"
                            mt={1}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isFavFilter ? 
                        <IconButton
                            aria-label="favorite"
                            borderRadius="md"
                            variant="ghost"
                            colorPalette="red"
                            mb={1}
                            onClick={handleFavSort}
                        >
                            <FaHeart />
                        </IconButton>
                        :
                        <IconButton
                            aria-label="favorite"
                            borderRadius="md"
                            variant="ghost"
                            mb={1}
                            onClick={handleFavSort}
                        >
                            <FaHeart />
                        </IconButton>
                        }
                    </HStack>
                    <Grid 
                        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                        gap="6"
                    >
                        {filteredRecipes.map((recipe, index) => (
                            <GridItem 
                                key={index} 
                                colSpan={1} 
                                mb={4} 
                                borderRadius="2xl" 
                                _hover={{ cursor: 'pointer', boxShadow: 'lg' }} 
                                onClick={() => fetchRecipeDetails(recipe.recipe_id)}
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
                                    <Image 
                                        src={recipe.image ? `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}/${recipe.image}` : `${TempImg}`} 
                                        borderTopRadius="2xl"
                                        alt="Recipe" 
                                        maxWidth="100%" 
                                        height="auto" 
                                    />
                                    <Card.Body >
                                        <Card.Title
                                            style={{
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: '1.5em',
                                                minHeight: '3em',
                                                fontFamily: "'Baloo 2', bold",
                                            }}
                                        >
                                            {recipe.name}
                                        </Card.Title>
                                        <Card.Description fontFamily="'Baloo 2', bold">{recipe.categories}</Card.Description>
                                    </Card.Body>
                                    {recipe.is_favorite && (
                                        <Icon
                                            color="red.500"
                                            position="absolute"
                                            bottom="8px"
                                            right="8px"
                                            boxSize="24px"
                                        >
                                            <FaHeart />
                                        </Icon>
                                    )}
                                </Card.Root>

                            </GridItem>
                        ))}
                    </Grid>
                </Box>
            </Box>
            <DrawerRoot open={isDrawerOpen} size="sm" onOpenChange={(e) => setIsDrawerOpen(e.open)} style={{ zIndex: 999 }}>
                <DrawerBackdrop />
                <DrawerContent>
                    <DrawerCloseTrigger />
                    <DrawerHeader>
                        <DrawerTitle fontFamily="'Baloo 2', bold">{selectedRecipe?.name}</DrawerTitle>
                    </DrawerHeader>
                    <DrawerBody>
                        <Box mb={4}>
                            <Image 
                                src={selectedRecipe?.image ? `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}/${selectedRecipe.image}` : `${TempImg}`} 
                                alt="Recipe" 
                                maxWidth="100%" 
                                height="auto" 
                                borderRadius="2xl"
                            />
                        </Box>
                        {selectedRecipe && (
                            <Fragment>
                                <Text fontWeight="bold" mt={4} fontFamily="'Baloo 2', bold">Ingredients:</Text>
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <Text key={index} fontFamily="'Baloo 2', bold">
                                        {index + 1}. {ingredient.name}: {ingredient.quantity}
                                    </Text>
                                ))}
                                <Text fontWeight="bold" mt={4} fontFamily="'Baloo 2', bold">Steps:</Text>
                                {selectedRecipe.steps.map((step, index) => (
                                    <Text key={index} fontFamily="'Baloo 2', bold">
                                        {index + 1}. {step.description}
                                    </Text>
                                ))}
                                <Text fontWeight="bold" mt={4} fontFamily="'Baloo 2', bold">Notes:</Text>
                                <Box whiteSpace="pre-wrap" mt={2} fontFamily="'Baloo 2', bold">
                                    {selectedRecipe.notes}
                                </Box>
                            </Fragment>
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        <HStack spacing={3}>
                        <Button 
                                onClick={handleDeleteClick} 
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
                                >
                                    Delete
                                </Button>
                            <Button 
                                onClick={handleEditClick} 
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
                            >
                                Edit
                            </Button>
                            <Dialog.Root
                                placement="center"
                                motionPreset="slide-in-bottom"
                                size={{ base: 'sm', md: 'lg' }}
                            >
                                <Dialog.Trigger asChild>
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
                                    >
                                        Add To Meal Plan
                                    </Button>
                                </Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                        <Dialog.Content borderRadius="20px">
                                            <form onSubmit={handleAddMealPlan}>
                                                <Dialog.Header>
                                                    <Dialog.Title fontFamily="'Baloo 2', bold">Add to Meal Plan</Dialog.Title>
                                                </Dialog.Header>
                                                <Dialog.Body>
                                                    <Text fontFamily="'Baloo 2', bold">Select a date:</Text>
                                                    <NativeSelect.Root>
                                                        <NativeSelect.Field
                                                            placeholder="select option..."
                                                            fontFamily="'Baloo 2', bold"
                                                            bg="yellow.100"
                                                            borderRadius="2xl"
                                                            border="2px solid #5C3B1E"
                                                            _hover={{ bg: 'orange.100' }}
                                                            _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                                            fontWeight="bold"
                                                            value={mealPlanId}
                                                            onChange={(e) => setMealPlanId(e.target.value)}
                                                        >
                                                            {mealPlans.map((mealPlan, index) => (
                                                                <option key={index} value={mealPlan.meal_plan_id}>
                                                                    {mealPlan.name}
                                                                </option>
                                                            ))}
                                                        </NativeSelect.Field>
                                                    </NativeSelect.Root>
                                                </Dialog.Body>
                                                <Dialog.Footer>
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
                                                        Add to Meal Plan
                                                    </Button>
                                                </Dialog.Footer>
                                            </form>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>
                            {selectedRecipe && selectedRecipe.is_favorite ?
                                <IconButton
                                    aria-label="favorite"
                                    borderRadius="md"
                                    variant="ghost"
                                    colorPalette="red"
                                    mb={3}
                                    onClick={handleDelFavClick}
                                >
                                    <FaHeart />
                                </IconButton>
                                :
                                <IconButton
                                    aria-label="favorite"
                                    borderRadius="md"
                                    variant="ghost"
                                    mb={3}
                                    onClick={handleAddFavClick}
                                >
                                    <FaHeart />
                                </IconButton>
                            }
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerRoot>
            <Stack position="fixed" bottom="20px" left="50%" transform="translateX(-50%)" width="90%" maxWidth="400px" spacing={4}>               
                {loading && (
                    <Alert.Root
                        title="Loading..."
                        status="info"
                    >
                    <Alert.Indicator>
                        <Spinner size="sm" />
                    </Alert.Indicator>
                        <Alert.Title>Loading...</Alert.Title>
                    </Alert.Root>
                )}
                {success && (
                    <Alert.Root status="success">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>Recipe deleted successfully!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {error && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>There was an error deleting the recipe. Please try again later.</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setError(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {success2 && (
                    <Alert.Root status="success">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>Recipe Added successfully!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {error2 && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>There was an error adding recipe to meal plan. Please try again later.</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setError(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
            </Stack>
        </Fragment>
    );
}

export default Category;