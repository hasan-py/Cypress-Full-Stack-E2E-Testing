import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  Text,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../_helper/localstorage";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = getLocalStorageData("token");
  const toast = useToast();

  return (
    <Box w="full" as="section" pb={4}>
      <Box
        w="full"
        zIndex={999}
        position="fixed"
        top={0}
        as="nav"
        bg="bg-surface"
        px={{ base: "4", lg: "16" }}
        py={{ base: "4", lg: "5" }}
        className="bg-gray-900"
      >
        <HStack justify="space-between">
          <Flex justify="space-between" flex="1">
            <Text
              onClick={() => {
                navigate("/");
              }}
              fontSize="2xl"
              fontWeight={700}
              cursor={"pointer"}
            >
              <span className="text-protest text-gray-50">Game Zonex</span>
            </Text>

            {token ? (
              <>
                <ButtonGroup variant="link" spacing="8">
                  {window.location.pathname.includes("/admin") ? null : (
                    <button
                      onClick={() => {
                        navigate("/admin");
                      }}
                      className="px-8 pb-1 text-yellow-500 font-bold rounded-full"
                    >
                      Go to Admin
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setLocalStorageData("token", "");
                      navigate("/login");

                      toast({
                        title: `Logout successful`,
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                    id="logout-button"
                    className="px-8 pb-1 bg-yellow-500 text-black font-bold rounded-full"
                  >
                    Logout
                  </button>
                </ButtonGroup>
              </>
            ) : (
              <ButtonGroup variant="link" spacing="8">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="px-8 pb-1 bg-yellow-500 text-black font-bold rounded-full"
                >
                  Login
                </button>
              </ButtonGroup>
            )}
          </Flex>
        </HStack>
      </Box>
    </Box>
  );
};
