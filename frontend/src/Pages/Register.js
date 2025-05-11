import { Fragment, useState } from "react";
import { Box, Button, Field, Input, Stack, Text, Alert, NativeSelect, Float, FileUpload, useFileUploadContext } from "@chakra-ui/react";
import { CloseButton } from "../components/ui/close-button";
import { PasswordInput } from "../components/ui/password-input";
import { LuFileImage, LuX } from "react-icons/lu"
import { IoIosLogIn } from "react-icons/io";
import CookbookBackgroundLarge from './comp/style/img/CookbookBackground1.png';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(null);
    const [question1, setQuestion1] = useState("");
    const [question2, setQuestion2] = useState("");
    const [answer1, setAnswer1] = useState("");
    const [answer2, setAnswer2] = useState("");
    const [error, setError] = useState(false);
    const [failedSecurity, setFailedSecurity] = useState(false);
    const [failedPassword, setFailedPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleQuestion1 = (e) => {
        setQuestion1(e.target.value);
    };

    const handleQuestion2 = (e) => {
        setQuestion2(e.target.value);
    };

    const handleAnswer1 = (e) => {
        setAnswer1(e.target.value);
    };

    const handleAnswer2 = (e) => {
        setAnswer2(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
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
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setError(false);
        setSuccess(false);
        setFailedSecurity(false);
        setFailedPassword(false);

        const path = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_API_PORT}`;

        // Ensure passwords match
        if (password !== confirmPassword) {
            setFailedPassword(true);
            setTimeout(() => {
                setFailedPassword(false);
            }, 3000);
            return;
        }

        // Ensure 2 different security questions selected
        if (question1 === question2) {
            setFailedSecurity(true);
            setTimeout(() => {
                setFailedSecurity(false);
            }, 3000);
            return;
        }

        // Create FormData to send the data, including the image
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("question1", question1);
        formData.append("question2", question2);
        formData.append("answer1", answer1);
        formData.append("answer2", answer2);
        if (image) {
            formData.append("profileImage", image); // Append the image file
        }

        try {
            const response = await fetch(`http://${path}/api/register`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("User registered successfully:", data);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate("/login");
                }, 3000);
            } else {
                const error = await response.json();
                console.error("Error registering user:", error);
                setError(true);
                setTimeout(() => setError(false), 3000);
            }
        } catch (err) {
            console.error("Error:", err);
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
                <Box width={{ base: "90%", md: "80%" }} mt={10}>
                    <Text textStyle="xl" fontWeight="bold" fontFamily="'Baloo 2', bold" color="orange.600">
                        New User:
                    </Text>
                    <form onSubmit={onSubmit}>
                        <Stack gap="4" align="flex-start" maxW="sm">
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

                            <Field.Root>
                                <Field.Label fontFamily="'Baloo 2', bold">Confirm</Field.Label>
                                <PasswordInput 
                                    placeholder="Password"
                                    fontFamily="'Baloo 2', bold"
                                    bg="yellow.100"
                                    borderRadius="2xl"
                                    border="2px solid #5C3B1E"
                                    _hover={{ bg: 'orange.100' }}
                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                    fontWeight="bold"
                                    value={confirmPassword} 
                                    onChange={handleConfirmPassword} 
                                />
                                <Field.ErrorText></Field.ErrorText>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontFamily="'Baloo 2', bold">Secuirty Question 1</Field.Label>
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
                                        value={question1}
                                        onChange={handleQuestion1}
                                    >
                                        <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                        <option value="What is your favorite color?">What is your favorite color?</option>
                                        <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                                        <option value="What is your favorite food?">What is your favorite food?</option>
                                        <option value="What is your dream job?">What is your dream job?</option>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                                <Field.ErrorText></Field.ErrorText>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontFamily="'Baloo 2', bold">Answer 1</Field.Label>
                                <PasswordInput 
                                    placeholder="Answer"
                                    fontFamily="'Baloo 2', bold"
                                    bg="yellow.100"
                                    borderRadius="2xl"
                                    border="2px solid #5C3B1E"
                                    _hover={{ bg: 'orange.100' }}
                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                    fontWeight="bold"
                                    value={answer1} 
                                    onChange={handleAnswer1} 
                                />
                                <Field.ErrorText></Field.ErrorText>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontFamily="'Baloo 2', bold">Secuirty Question 2</Field.Label>
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
                                        value={question2}
                                        onChange={handleQuestion2}
                                    >
                                        <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                        <option value="What is your favorite color?">What is your favorite color?</option>
                                        <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                                        <option value="What is your favorite food?">What is your favorite food?</option>
                                        <option value="What is your dream job?">What is your dream job?</option>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                                <Field.ErrorText></Field.ErrorText>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontFamily="'Baloo 2', bold">Answer 2</Field.Label>
                                <PasswordInput 
                                    placeholder="Answer"
                                    fontFamily="'Baloo 2', bold"
                                    bg="yellow.100"
                                    borderRadius="2xl"
                                    border="2px solid #5C3B1E"
                                    _hover={{ bg: 'orange.100' }}
                                    _focus={{ borderColor: 'orange.400', boxShadow: 'none' }}
                                    fontWeight="bold"
                                    value={answer2} 
                                    onChange={handleAnswer2} 
                                />
                                <Field.ErrorText></Field.ErrorText>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontFamily="'Baloo 2', bold">Profile Image</Field.Label>
                                <FileUpload.Root accept="image/*" onChange={handleImageChange}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button variant="outline" size="sm">
                                        <LuFileImage /> Upload Image
                                        </Button>
                                    </FileUpload.Trigger>
                                    <FileUploadList />
                                </FileUpload.Root>
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
                                fontFamily="'Baloo 2', bold" 
                                width="100%"
                            >
                                Submit
                            </Button>
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
                            <Alert.Description>Failed to register!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setError(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {failedSecurity && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>Security questions must be different!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setFailedSecurity(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {failedPassword && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Error!</Alert.Title>
                            <Alert.Description>Passwords do not match!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setFailedPassword(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
                {success && (
                    <Alert.Root status="success">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>User registered successfully!</Alert.Description>
                        </Alert.Content>
                        <CloseButton onClick={() => setSuccess(false)} pos="relative" top="-2" insetEnd="-2" />
                    </Alert.Root>
                )}
            </Stack>
        </Fragment>
    );
};

export default Register;