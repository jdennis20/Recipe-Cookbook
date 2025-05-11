import React, { Fragment, useState } from "react";
import { Box, Stack, HStack, Button, Field, VStack, Spinner, Alert, Input } from '@chakra-ui/react';
import { CloseButton } from "../components/ui/close-button";
import { PasswordInput } from "../components/ui/password-input";
import CookbookBackgroundLarge from './comp/style/img/CookbookBackground1.png';
import { useNavigate } from 'react-router-dom';
import { IoIosLogIn } from "react-icons/io";

function PasswordReset() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [answer1, setAnswer1] = useState("");
    const [answer2, setAnswer2] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [valid, setValid] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorUser, setErrorUser] = useState(false);
    const [failedAnswer, setFailedAnswer] = useState(false);

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    const handleAnswer1Change = (e) => {
        setAnswer1(e.target.value);
    };

    const handleAnswer2Change = (e) => {
        setAnswer2(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleUserSearch = async (e) => {
        e.preventDefault();

        setErrorUser(false);

        setLoading(true);

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

            fetch(`http://${path}/api/user-reset/${username}`, {
                method: "GET",
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
            .catch( (error) => {
                console.error('Error fetching user:', error);
                setErrorUser(true);
                setTimeout(() => setErrorUser(false), 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFailedAnswer(false);

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        fetch(`http://${path}/api/user-reset-check/${username}/${answer1}/${answer2}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get user");
                }
                return response.json();
            })
            .then(data => {
                setValid(data.valid);
                console.log('Valid data:', data);
            })
            .catch( (error) => {
                console.error('Error fetching user:', error);
                setFailedAnswer(true);
                setTimeout(() => setFailedAnswer(false), 3000);
            });
    };

    const handleSubmitReset = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(false);

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        // Ensure passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const data = {
            username: username,
            newPassword: password,
        };

        fetch(`http://${path}/api/user-reset-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get user");
                }
                return response.json();
            })
            .then(data => {
                console.log('User data:', data);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/login'); // Navigate after success alert disappears
                }, 3000);
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
                setError(true);
                setTimeout(() => setError(false), 3000);
            });
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
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="transparent"
            >
                <Box
                    position="absolute"
                    top="20px"
                    right="20px"
                    p={4}
                >
                    <Button 
                        onClick={() => navigate("/login")} 
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
                        fontFamily="'Baloo 2', bold">
                            <IoIosLogIn /> Login
                        </Button>
                </Box>                
                <Box width={{ base: "90%", md: "80%" }}>
                    <Stack>
                        <Field.Root>
                            <Field.Label fontFamily="'Baloo 2', bold">Username</Field.Label>
                            <HStack spacing={4}>
                                <Input
                                    placeholder="Username"
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
                                    fontFamily="'Baloo 2', bold" 
                                    onClick={handleUserSearch}>
                                    Search
                                </Button>
                            </HStack>
                            <Field.ErrorText></Field.ErrorText>
                        </Field.Root>
                    </Stack>
                    {loading ? (
                    <VStack mt={4} color="black">
                        <Spinner color="black" />
                    </VStack>
                    ) : user ? (
                    valid ? (
                        // Render password update fields if valid is true
                        <Stack mt={4}>
                            <form onSubmit={handleSubmitReset}>
                                <Field.Root>
                                    <Field.Label fontFamily="'Baloo 2', bold">New Password</Field.Label>
                                    <PasswordInput
                                        placeholder="New Password"
                                        size="md"
                                        fontFamily="'Baloo 2', bold"
                                        bg="yellow.100"
                                        borderRadius="2xl"
                                        border="2px solid #5C3B1E"
                                        _hover={{ bg: 'orange.100' }}
                                        _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                        fontWeight="bold"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    <Field.ErrorText></Field.ErrorText>
                                </Field.Root>
                                <Field.Root mt={4}>
                                    <Field.Label fontFamily="'Baloo 2', bold">Confirm Password</Field.Label>
                                    <PasswordInput
                                        placeholder="Confirm Password"
                                        size="md"
                                        fontFamily="'Baloo 2', bold"
                                        bg="yellow.100"
                                        borderRadius="2xl"
                                        border="2px solid #5C3B1E"
                                        _hover={{ bg: 'orange.100' }}
                                        _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                        fontWeight="bold"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    <Field.ErrorText></Field.ErrorText>
                                </Field.Root>
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
                                    mt={4}
                                >
                                    Update
                                </Button>
                            </form>
                        </Stack>
                    ) : (
                        // Render security questions if valid is false
                        <Stack mt={4}>
                            <form onSubmit={handleSubmit}>
                                <Field.Root>
                                    <Field.Label fontFamily="'Baloo 2', bold">{user?.question1}</Field.Label>
                                    <Input
                                        placeholder="Answer"
                                        size="md"
                                        fontFamily="'Baloo 2', bold"
                                        bg="yellow.100"
                                        borderRadius="2xl"
                                        border="2px solid #5C3B1E"
                                        _hover={{ bg: 'orange.100' }}
                                        _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                        fontWeight="bold"
                                        onChange={handleAnswer1Change}
                                    />
                                    <Field.ErrorText></Field.ErrorText>
                                </Field.Root>
                                <Field.Root mt={4}>
                                    <Field.Label fontFamily="'Baloo 2', bold">{user?.question2}</Field.Label>
                                    <Input
                                        placeholder="Answer"
                                        fontFamily="'Baloo 2', bold"
                                        size="md"
                                        bg="yellow.100"
                                        borderRadius="2xl"
                                        border="2px solid #5C3B1E"
                                        _hover={{ bg: 'orange.100' }}
                                        _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                        fontWeight="bold"
                                        onChange={handleAnswer2Change}
                                    />
                                    <Field.ErrorText></Field.ErrorText>
                                </Field.Root>
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
                                    mt={4}
                                >
                                    Check
                                </Button>
                            </form>
                        </Stack>
                    )
                ) : null}
                </Box>
            </Box>
            <Stack position="fixed" bottom="20px" left="50%" transform="translateX(-50%)" width="90%" maxWidth="400px" spacing={4}> 
                {success && (
                    <Alert.Root status="success">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>Password Reset successfully!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {error && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>Failed to reset password!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setError(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {errorUser && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>Failed to get user!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setErrorUser(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {failedAnswer && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>Failed to answer security questions!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setFailedAnswer(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
            </Stack>
        </Fragment>
    );
}

export default PasswordReset;
