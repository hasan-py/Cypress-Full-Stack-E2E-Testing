import {
  EmailIcon,
  LockIcon,
  MinusIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCheckModeratorCreate } from "../../api/useCheckModeratorCreate";
import { useCreateModerator } from "../../api/useCreateModerator";
import { useLogin } from "../../api/useLogin";
import Hero from "../../components/hero";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { data, isLoading: checkModeratorCreateLoading } =
    useCheckModeratorCreate();
  const {
    isSuccess,
    isLoading: moderatorCreateLoading,
    mutate: moderatorCreateMutate,
  } = useCreateModerator();
  const { isLoading: loginLoading, mutate: loginMutate } = useLogin();

  const schema = z.object({
    name: data?.userExists
      ? z.string().optional()
      : z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const validateForm = () => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (e) {
      const zodErrors = (e as z.ZodError).flatten().fieldErrors;
      const filteredErrors: Record<string, string> = Object.keys(
        zodErrors
      ).reduce((acc, key) => {
        const fieldErrors = zodErrors[key];
        if (fieldErrors) {
          acc[key] = fieldErrors[0];
        }
        return acc;
      }, {} as Record<string, string>);

      setErrors(filteredErrors);
      return false;
    }
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (!data?.userExists) {
      moderatorCreateMutate(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: () => {
            setErrors({});
          },
        }
      );
    } else {
      loginMutate(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: () => {
            setErrors({});
          },
        }
      );
    }
  };

  if (checkModeratorCreateLoading) {
    return (
      <Flex w="full" h="100vh" alignItems={"center"} justifyContent={"center"}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
      alignItems={"center"}
      width="100wh"
      height="100vh"
      bg={"gray-900"}
    >
      <Hero />

      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        bg="white"
        width={"50%"}
        boxShadow={"lg"}
        rounded={"lg"}
        position={"relative"}
        top={-10}
        paddingY={16}
        paddingX={8}
      >
        <Heading size={"lg"} color="black">
          Moderator {data?.userExists ? "Login" : "Create Account"}
        </Heading>

        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack rounded={"lg"} spacing={4} p="1rem">
              {data?.userExists ? null : (
                <FormControl isInvalid={!!errors.name}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<MinusIcon color="black" />}
                    />
                    <Input
                      value={formData.name}
                      type="text"
                      onChange={(e: any) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Name"
                      autoComplete="off"
                      variant="filled"
                      borderColor={errors.name ? "red.500" : "inherit"}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors["name"]}</FormErrorMessage>
                </FormControl>
              )}

              <FormControl isInvalid={!!errors.email}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<EmailIcon color="black" />}
                  />
                  <Input
                    value={formData.email}
                    onChange={(e: any) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    type="email"
                    variant="filled"
                    placeholder="Email"
                    autoComplete="off"
                    borderColor={errors.email ? "red.500" : "inherit"}
                  />
                </InputGroup>
                <FormErrorMessage>{errors["email"]}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="black"
                    children={<LockIcon color="black" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                    value={formData.password}
                    variant="filled"
                    onChange={(e: any) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    borderColor={errors.password ? "red.500" : "inherit"}
                  />
                  <InputRightElement
                    width="4.5rem"
                    id="toggle-password"
                    onClick={handleShowClick}
                  >
                    {showPassword ? (
                      <ViewIcon color="gray.500" cursor={"pointer"} />
                    ) : (
                      <ViewOffIcon color="gray.500" cursor={"pointer"} />
                    )}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors["password"]}</FormErrorMessage>
              </FormControl>

              {isSuccess ? (
                <Text color="green.500">
                  {"Moderator created! Please login!"}
                </Text>
              ) : null}

              <button
                type="button"
                disabled={loginLoading || moderatorCreateLoading}
                onClick={handleSubmit}
                className="px-8 p-2 bg-yellow-500 border-2 text-black font-bold uppercase"
              >
                {data?.userExists ? "Login" : "Create"}
              </button>
            </Stack>
          </form>
        </Box>
      </Stack>

      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        className="text-center text-gray-500"
      >
        Goto to home page?
        <Text
          color="blue.600"
          onClick={() => {
            navigate("/");
          }}
          cursor={"pointer"}
          marginLeft={2}
        >
          Click here
        </Text>
      </Flex>
    </Flex>
  );
};

export default Login;
