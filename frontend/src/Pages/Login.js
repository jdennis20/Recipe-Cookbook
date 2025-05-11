import { Fragment, useState } from "react";
import { Box, Button, Field, Input, Stack, Link, Alert, Image } from "@chakra-ui/react";
import { CloseButton } from "../components/ui/close-button";
import { PasswordInput } from "../components/ui/password-input"
import CookbookBackgroundLarge from './comp/style/img/CookbookBackground.png';
import Logo from './comp/style/img/Family_Cookbook_Logo.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [failedLogin, setFailedLogin] = useState(false);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setFailedLogin(false);

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        const data = {
            username: username,
            password: password,
        };
    
        try {
            const response = await fetch(`http://${path}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("Login successful:", result);
    
                // Store the token in localStorage or a cookie
                sessionStorage.setItem("token", result.token);
    
                // Redirect to home
                navigate('/home');
            } else {
                const error = await response.json();
                console.error("Login failed:", error);
                setFailedLogin(true);
                setTimeout(() => setFailedLogin(false), 3000);
            }
        } catch (err) {
            console.error("Error:", err);
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    function handleRegister() {
        navigate('/reg');
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
                display="flex" // Add this
                justifyContent="center" // Add this
                alignItems="center" // Add this
                bg="transparent"
            >
                <Box
                    width={{ base: "90%", md: "80%" }}
                >
                    <form onSubmit={onSubmit}>
                    <Stack gap="4" align="flex-start" maxW="sm">
                    <Image
                        src={Logo}
                        alt="Logo"
                        width= "200px" // Adjust the width for smaller screens
                        display="block"
                        alignSelf="center"
                    />
                            <Field.Root>
                            <Field.Label fontFamily="'Baloo 2', bold">Username</Field.Label>
                            <Input 
                                placeholder="Username"
                                fontFamily="'Baloo 2', bold"
                                bg="yellow.100"
                                borderRadius="2xl"
                                border="2px solid #5C3B1E"
                                _hover={{ bg: 'orange.100' }}
                                _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                fontWeight="bold"
                                value={username} 
                                onChange={handleUsername} 
                            />
                            <Field.ErrorText></Field.ErrorText>
                            </Field.Root>
    
                            <Field.Root>
                            <Field.Label fontFamily="'Baloo 2', bold">Password</Field.Label>
                            <PasswordInput 
                                placeholder="Password"
                                fontFamily="'Baloo 2', bold"
                                bg="yellow.100"
                                borderRadius="2xl"
                                border="2px solid #5C3B1E"
                                _hover={{ bg: 'orange.100' }}
                                _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                fontWeight="bold"
                                value={password} 
                                onChange={handlePassword} 
                            />
                            <Field.ErrorText></Field.ErrorText>
                            </Field.Root>
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
                                    width="100%"
                                    onClick={handleRegister}
                                >Register</Button>
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
                                    width="100%"
                                    fontFamily="'Baloo 2', bold"
                                    type="submit"
                                    >
                                    Login
                                </Button>
                                <Link variant="underline" href="/password-reset" size="sm" fontFamily="'Baloo 2', bold" color="orange.600" justifyContent="center" width="100%">
                                    Forgot Password?
                                </Link>
                        </Stack>
                    </form>
                </Box>
            </Box>
            <Stack position="fixed" bottom="20px" left="50%" transform="translateX(-50%)" width="90%" maxWidth="400px" spacing={4}> 
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
                {failedLogin && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>Failed to login!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setFailedLogin(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}          
            </Stack>
        </Fragment>
    )
}

export default Login;