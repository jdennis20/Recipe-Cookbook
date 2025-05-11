import React, { useState, Fragment, useEffect } from "react";
import { Box, HStack, VStack, Input, Button, Spinner, Text, Image, Alert } from "@chakra-ui/react";
import { CloseButton } from "../components/ui/close-button";
import { useNavigate } from 'react-router-dom';

// External assets
import CookbookBackgroundLarge from './comp/style/img/CookbookBackground1.png';

// Local components
import Logo from './comp/Logo';
import AccountIcon from './comp/AccountIcon';
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


function Search() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [steps, setSteps] = useState([]);
  const [ing, setIng] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recipeSelected, setRecipeSelected] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
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

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);

    if (search.includes(",")) {

      const ingredients = search.split(",").map((ingredient) => ingredient.trim());
      const searchResults = "20";
      const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
      const query = `http://${path}/api/getrecipesing?query=${ingredients.join(",")}&number=${searchResults}`;
      console.log(query);

      try {
        const response = await fetch(query, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log(data);

        const extractedData = data.map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
        }));
        setRecipes(extractedData);
        console.log(extractedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }
    else {
      try {
        const searchResults = "20";
        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
        const query = `http://${path}/api/getrecipes?query=${search}&number=${searchResults}`;
        console.log(query);

        const response = await fetch(query, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log(data);

        const extractedData = data.results.map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
        }));
        setRecipes(extractedData);
        console.log(extractedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleItemDetail = async (recipeID) => {
    // Get Instructions
    try {
      const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
      const query = `http://${path}/api/getrecipeinfo?id=${recipeID}`;
      console.log(query);

      const response = await fetch(query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);

      const extractedInstructions = data[0].steps.map((step, index) => ({
        stepNumber: index + 1,
        instruction: step.step,
      }));

      setSteps(extractedInstructions);
      console.log(extractedInstructions);
    } catch (error) {
      console.error("Error fetching Item instructions: ", error);
      console.log("Error fetching Item instructions: ", error);
    }

    // Get ingredients
    try {
      const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
      const query = `http://${path}/api/getrecipeing?id=${recipeID}`;
      console.log(query);

      const response = await fetch(query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);

      const extractedIngredients = data.ingredients.map((ingredient, index) => ({
        ingNumber: index + 1,
        name: ingredient.name,
        amount: `${ingredient.amount.us.value} ${ingredient.amount.us.unit}`,
      }));

      setIng(extractedIngredients);
      console.log(extractedIngredients);
    } catch (error) {
      console.error("Error fetching Item ingredients: ", error);
      console.log("Error fetching Item ingredients: ", error);
    }

    // Open drawer and set selected recipe
    const selected = recipes.find((recipe) => recipe.id === recipeID);
    setRecipeSelected(selected);
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting recipe..."); // debug
    const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
    const name = recipeSelected.title;

    try {
        // Step 1: Download the image using the proxy endpoint
        const imageResponse = await fetch(`http://${path}/api/proxy-image?url=${encodeURIComponent(recipeSelected.image)}`);
        const imageBlob = await imageResponse.blob();

        // Step 2: Create a FormData object and append the image Blob to it
        const formData = new FormData();
        formData.append('image', imageBlob, 'recipe-image.jpg');
        formData.append('name', name);
        formData.append('ing', JSON.stringify(ing));
        formData.append('steps', JSON.stringify(steps));

        // Retrieve the token from localStorage
        const token = sessionStorage.getItem('token');

        // Step 3: Send the FormData object to your backend server
        await fetch(`http://${path}/api/search/add`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: formData,
        })

            .then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        throw new Error("Authorization failed. Please log in again.");
                    }
                    throw new Error("Failed to submit recipe.");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setLoading2(false);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            })
            .catch((err) => {
                console.error(err);
                setLoading2(false);
                setError(true);
                setTimeout(() => setError(false), 3000);
            });
    } catch (err) {
        console.error(err);
        setLoading2(false);
        setError(true);
        setTimeout(() => setError(false), 3000);
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
      <Box minHeight="100vh" width="100%" position="relative" bg="transparent">
        <Box
          position="absolute"
          top="20px"
          left="50%"
          transform="translateX(-50%)"
          p={4}
          borderRadius="md"
          bg="transparent"
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
          position="absolute"
          top="200px"
          left="50%"
          transform="translateX(-50%)"
          width="80%"
          bg="transparent"
        >
          <HStack spacing={4}>
            <Input
              placeholder="Recipe name or ingredient1, inredient2, ..."
              size="md"
              fontFamily="'Baloo 2', bold"
              bg="yellow.100"
              borderRadius="2xl"
              border="2px solid #5C3B1E"
              _hover={{ bg: 'orange.100' }}
              _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
              fontWeight="bold"
              onChange={handleInputChange}
            />
            <Button 
              onClick={handleSearch}
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
              fontFamily="'Baloo 2', bold"
              bg="#FFE47A" // light yellow
              color="black"
            >
              Search
            </Button>
          </HStack>

          {loading ? (
            <VStack mt={4} color="black">
              <Spinner color="black" />
              <Text color="black" fontFamily="'Baloo 2', bold">Searching...</Text>
            </VStack>
          ) : (
            <Box mt={4}>
              {recipes.map((recipe) => (
                <Box
                  onClick={() => handleItemDetail(recipe.id)}
                  key={recipe.id}
                  p={{ base: 1, md: 2 }}
                  borderWidth="1px"
                  borderRadius="md"
                  mb={3}
                  overflow="hidden"
                  bg="white"
                  _hover={{ background: "gray.100" }}
                  cursor="pointer"
                  height="auto"
                >
                  <HStack alignItems="center" spacing={3}>
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      boxSize="70px"
                      borderRadius="2xl"
                      mr={3}
                    />
                    <Box flex="1" textAlign="left" width="calc(100% - 80px)">
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        width="100%"
                        mt="1.0em"
                        fontFamily="'Baloo 2', bold"
                      >
                        {recipe.title}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <DrawerRoot open={drawerOpen} size="sm" onOpenChange={(e) => setDrawerOpen(e.open)} style={{ zIndex: 999 }}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerCloseTrigger />
          <DrawerHeader>
            <DrawerTitle fontFamily="'Baloo 2', bold">{recipeSelected?.title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Image src={recipeSelected?.image} alt={recipeSelected?.title} mb={4} borderRadius="2xl"/>
            <Text fontWeight="bold" fontFamily="'Baloo 2', bold" mt={4}>Ingredients:</Text>
            {ing.map((ingredient) => (
              <Text key={ingredient.ingNumber} fontFamily="'Baloo 2', bold">
                {ingredient.ingNumber}. {ingredient.name}: {ingredient.amount}
              </Text>
            ))}
            <Text fontWeight="bold" mt={4} fontFamily="'Baloo 2', bold">Instructions:</Text>
            {steps.map((step) => (
              <Text key={step.stepNumber} fontFamily="'Baloo 2', bold">
                {step.stepNumber}. {step.instruction}
              </Text>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Button 
              onClick={handleSubmit} 
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
              bg="#FFE47A" // light yellow
              >Add Recipe</Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>

      {loading2 && (
        <Alert.Root
          title="Loading..."
          status="info"
          style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1001 }}
        >
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Title>Loading...</Alert.Title>
        </Alert.Root>
      )}
      {success && (
        <Alert.Root status="success" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1001 }}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Success!</Alert.Title>
            <Alert.Description>Recipe submitted successfully!</Alert.Description>
          </Alert.Content>
          <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
        </Alert.Root>
      )}
      {error && (
        <Alert.Root status="error" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1001 }}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Error!</Alert.Title>
            <Alert.Description>There was an error submitting the recipe. Please try again later.</Alert.Description>
          </Alert.Content>
          <CloseButton onClick={() => setError(false)} pos="relative" top="-2" insetEnd="-2" />
        </Alert.Root>
      )}
    </Fragment>
  );
}

export default Search;