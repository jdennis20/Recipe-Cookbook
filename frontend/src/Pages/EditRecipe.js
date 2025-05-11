import React, { Fragment, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box, Text, HStack, Input, Button, VStack, Icon, Textarea, Alert, Spinner, Stack, Image, Float, FileUpload, useFileUploadContext } from "@chakra-ui/react";
import { CloseButton } from "../components/ui/close-button";
import CookbookBackgroundLarge from "./comp/style/img/CookbookBackground1.png";
import { useNavigate } from 'react-router-dom';
import TempImg from "./comp/style/img/CartoonPlate.png";
import Logo from "./comp/Logo";
import { FaPlus, FaMinus } from "react-icons/fa";
import { LuFileImage, LuX } from "react-icons/lu"

function EditRecipe() {
    const { recipe_id } = useParams();
    // ignore error on next line
    // eslint-disable-next-line no-unused-vars
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [Steps, setSteps] = useState([{ step: "Step 1", direction: "" }]);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [notes, setNotes] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the token from localStorage
        const token = sessionStorage.getItem('token');

        // Redirect to login if no token is found
        if (!token) {
            navigate('/login');
            return;
        }
        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        fetch(`http://${path}/api/recipe/${recipe_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get recipe");
                }
                return response.json();
            })
            .then(data => {
                setRecipe(data);
                setName(data.name);
                setIngredients(data.ingredients.map(ingredient => ({ name: ingredient.name, amount: ingredient.quantity })));
                setSteps(data.steps.map((step, index) => ({ step: `Step ${index + 1}`, direction: step.description })));
                setCategories(data.categories ? data.categories.split(', ') : []); // Ensure categories are split into an array
                setNotes(data.notes);
                setImage(data.image);
            })
            .catch(error => console.error('Error fetching recipe details:', error));
    }, [recipe_id, navigate]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleNoteChange = (e) => {
        setNotes(e.target.value);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", amount: "" }]);
    };

    const handleAddStep = () => { 
        setSteps([...Steps, { step: `Step ${Steps.length + 1}`, direction: "" }]); 
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleRemoveStep = (index) => { 
        const newSteps = Steps.filter((_, i) => i !== index); 
        setSteps(newSteps.map((step, i) => ({ ...step, step: `Step ${i + 1}` }))); 
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file)); // Set the preview image
            setImage(file); // Keep the new image for submission
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...Steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const handleCategoryChange = (value) => {
        setCategories(
            categories.includes(value)
                ? categories.filter((category) => category !== value)
                : [...categories, value]
        );
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
        setLoading(true);
        setSuccess(false);
        setError(false);
        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;
    
        // Retrieve the token from localStorage
        const token = sessionStorage.getItem('token');

        // Log the data to be sent
        console.log("Submitting data:", {
            name,
            categories,
            ingredients,
            Steps,
            notes,
            image
        });
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("categories", JSON.stringify(categories || []));
        formData.append("ingredients", JSON.stringify(ingredients || []));
        formData.append("Steps", JSON.stringify(Steps || []));
        formData.append("notes", notes || "");
        if (image) {
            formData.append("image", image);
        }
    
        fetch(`http://${path}/api/edit-recipe/${recipe_id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: formData,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to edit recipe");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setLoading(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/home'); // Navigate after success alert disappears
                }, 3000);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                setError(true);
                setTimeout(() => setError(false), 3000);
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
                .label-container {
                    display: inline-block;
                    padding-right: 10px;
                }
                .category-container {
                    margin-top: 1em;
                }
                .toast { 
                    position: fixed; 
                    bottom: 20px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    padding: 10px 20px; 
                    background: lightcoral; 
                    color: white; 
                    border-radius: 5px; 
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
                }
            `}</style>
            <Box minHeight="100vh" width="100%" position="relative" bg="transparent" pb="250px">
                <Box position="absolute" top="20px" left="50%" transform="translateX(-50%)" p={4} borderRadius="md">
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
                                <Text fontSize={{ base: "lg", md: "xl" }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100%" mt="1.0em">Name:</Text>
                            </Box>
                            <Box width="100%" px={8}>
                                <Input 
                                    placeholder="" 
                                    value={name} 
                                    onChange={handleNameChange} 
                                    fontFamily="'Baloo 2', bold"
                                    bg="yellow.100"
                                    borderRadius="2xl"
                                    border="2px solid #5C3B1E"
                                    _hover={{ bg: 'orange.100' }}
                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                    fontWeight="bold"
                                />
                            </Box>
                            <Box width="100%" px={8}>
                                <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100%" mt="1.0em">Category:</Text>
                            </Box>
                            <Box width="100%" className="category-container" px={8}>
                                {["Breakfast", "Lunch", "Dinner", "Dessert", "Italian", "Mexican", "Asian", "American", "Healthy"].map((category) => (
                                    <label key={category} className="label-container">
                                        <input
                                            type="checkbox"
                                            value={category}
                                            checked={categories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        {category}
                                    </label>
                                ))}
                            </Box>
                            <Box width="100%" px={8}>
                                <Text 
                                    fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100%" mt="1.0em">Ingredients:</Text>
                                <VStack spacing={2} width="100%">
                                    {ingredients.map((ingredient, index) => (
                                        <HStack key={index} width="100%">
                                            <Input
                                                placeholder={`Ingredient ${index + 1}`}
                                                value={ingredient.name}
                                                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                                fontFamily="'Baloo 2', bold"
                                                bg="yellow.100"
                                                borderRadius="2xl"
                                                border="2px solid #5C3B1E"
                                                _hover={{ bg: 'orange.100' }}
                                                _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                                fontWeight="bold"
                                            />
                                            <Input
                                                placeholder="Amount"
                                                value={ingredient.amount}
                                                onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                                fontFamily="'Baloo 2', bold"
                                                bg="yellow.100"
                                                borderRadius="2xl"
                                                border="2px solid #5C3B1E"
                                                _hover={{ bg: 'orange.100' }}
                                                _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                                fontWeight="bold"
                                                ml={2}
                                            />
                                            <Button
                                                onClick={() => handleRemoveIngredient(index)}
                                                width="30px"
                                                height="30px"
                                                borderRadius="50%"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                colorPalette="red"
                                                ml={2}
                                            >
                                                <Icon>
                                                    <FaMinus />
                                                </Icon>
                                            </Button>
                                        </HStack>
                                    ))}
                                    <Button
                                        onClick={handleAddIngredient}
                                        width="30px"
                                        height="30px"
                                        borderRadius="50%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        colorScheme="teal"
                                        mt={4}
                                    >
                                        <Icon>
                                            <FaPlus />
                                        </Icon>
                                    </Button>
                                </VStack>
                            </Box>
                            <Box width="100%" px={8}>
                                <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100%" mt="1.0em">Steps:</Text>
                                <VStack spacing={2} width="100%">
                                    {Steps.map((step, index) => (
                                        <HStack key={index} width="100%">
                                            <Text flex="1" fontFamily="'Baloo 2', bold" width="100px">{step.step}</Text> 
                                            <Textarea 
                                                placeholder="Direction" 
                                                value={step.direction} 
                                                onChange={(e) => handleStepChange(index, "direction", e.target.value)} 
                                                fontFamily="'Baloo 2', bold"
                                                bg="yellow.100"
                                                borderRadius="2xl"
                                                border="2px solid #5C3B1E"
                                                _hover={{ bg: 'orange.100' }}
                                                _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                                fontWeight="bold"
                                                ml={2} 
                                                resize="vertical" 
                                                overflow="auto" 
                                                wordBreak="break-word" 
                                            />
                                            <Button
                                                onClick={() => handleRemoveStep(index)}
                                                width="30px"
                                                height="30px"
                                                borderRadius="50%"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                colorPalette="red"
                                                ml={2}
                                            >
                                                <Icon>
                                                    <FaMinus />
                                                </Icon>
                                            </Button>
                                        </HStack>
                                    ))}
                                    <Button
                                        onClick={handleAddStep}
                                        width="30px"
                                        height="30px"
                                        borderRadius="50%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        colorScheme="teal"
                                        mt={4}
                                    >
                                        <Icon>
                                            <FaPlus />
                                        </Icon>
                                    </Button>
                                </VStack>
                            </Box>
                            <Box width="100%" px={8}>
                                <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100%" mt="1.0em">Image:</Text>
                                <Box mb={4}>
                                <Image 
                                    src={
                                        previewImage 
                                        ? previewImage 
                                        : image 
                                        ? `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}/${image}` 
                                        : TempImg
                                    }
                                    alt="Recipe" 
                                    maxWidth="100%" 
                                    height="auto" 
                                    borderRadius="md"
                                />
                                </Box>
                                <FileUpload.Root accept="image/*" onChange={handleImageChange}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button variant="outline" size="sm" fontFamily="'Baloo 2', bold">
                                            <LuFileImage /> Upload Image
                                        </Button>
                                    </FileUpload.Trigger>
                                    <FileUploadList />
                                </FileUpload.Root>
                            </Box>
                            <Box width="100%" px={8}>
                                <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="'Baloo 2', bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width="100%" mt="1.0em">Notes:</Text>
                                <Textarea 
                                    placeholder="Notes" 
                                    value={notes}
                                    onChange={(e) => handleNoteChange(e)}
                                    fontFamily="'Baloo 2', bold"
                                    bg="yellow.100"
                                    borderRadius="2xl"
                                    border="2px solid #5C3B1E"
                                    _hover={{ bg: 'orange.100' }}
                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                    fontWeight="bold" 
                                    ml={2}
                                    resize="vertical" 
                                    overflow="auto" 
                                    wordBreak="break-word"
                                    whiteSpace="pre-wrap" 
                                />
                            </Box>
                        </VStack>
                        <Box width="100%" mt={4} px={8}> 
                            <Button 
                                type="submit" 
                                width="100%"
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
                            > 
                                Update Recipe 
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
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
                            <Alert.Description>Recipe updated successfully!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {error && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>There was an error updating the recipe. Please try again later.</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setError(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
            </Stack>
        </Fragment>
    );
}

export default EditRecipe;