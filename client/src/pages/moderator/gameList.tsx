import { DeleteIcon, EditIcon, StarIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  Flex,
  Image,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDeleteGame } from "../../api/useDeleteGame";
import { useGameList } from "../../api/useGameList";
import { useEditGame } from "../../api/useUpdateGame";
import Layout from "../../components/layout";
import LoadingSkeleton from "../../components/loadingSkeleton";
import { AddGameModal } from "./addGameModal";

export default function GamesList() {
  const toast = useToast();
  const { data, isLoading } = useGameList();
  const [editData, setEditData] = useState<any>();
  const disclosure = useDisclosure();
  const { onOpen } = disclosure;

  const { isLoading: deleteReviewLoading, mutate: deleteReviewMutate } =
    useEditGame();

  const { isLoading: deleteIsLoading, mutate: deleteGameMutate } =
    useDeleteGame();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isLoading && data?.length === 0) {
    return (
      <Layout>
        <AddGameModal
          disclosure={disclosure}
          setEditData={setEditData}
          editData={editData}
        />
        <Flex align="center" justify="center" direction="column" mt={20} mb={4}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Stack spacing={2}>
              <AlertTitle>No games listed</AlertTitle>
              <AlertDescription>
                Please add some games to get started.
              </AlertDescription>
            </Stack>
          </Alert>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <AddGameModal
        disclosure={disclosure}
        setEditData={setEditData}
        editData={editData}
      />

      <Flex alignItems={"center"} direction={"column"}>
        <Flex width={"60%"} direction="column" p={4}>
          {data?.map((item: any) => (
            <Card
              key={item._id}
              p={4}
              mb={4}
              borderRadius="md"
              boxShadow="md"
              bg="white"
              border="1px"
              borderColor="gray.200"
            >
              <Flex align="center" mb={4}>
                <Image
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                  src={
                    item?.gameImage ||
                    "https://cdn.mos.cms.futurecdn.net/jSAqsHHfjKpGqDfvG5Ccqe-1200-80.jpg.webp"
                  }
                  alt="Game Image"
                />
                <Box ml={4} flex="1">
                  <Text fontWeight="bold" fontSize="lg">
                    {item?.gameName}
                  </Text>
                  <Text mt={1} noOfLines={2}>
                    {item?.gameDescription}
                  </Text>
                </Box>
                <Flex direction="column" ml={4}>
                  <Button
                    variant="outline"
                    colorScheme="teal"
                    size="sm"
                    mb={2}
                    data-button="edit-game"
                    onClick={() => {
                      setEditData(item);
                      onOpen();
                    }}
                  >
                    <EditIcon mr={2} /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="sm"
                    data-button="delete-game"
                    onClick={() => {
                      if (!deleteIsLoading) {
                        deleteGameMutate(
                          {
                            _id: item?._id,
                          },
                          {
                            onSuccess: () => {
                              toast({
                                title: `Game deleted successfully`,
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                              });
                            },
                          }
                        );
                      }
                    }}
                  >
                    <DeleteIcon mr={2} /> Delete
                  </Button>
                </Flex>
              </Flex>
              <Box borderTop="1px" borderColor="gray.200" pt={4}>
                {item?.reviews?.length === 0 ? (
                  <Text textAlign="center" color="gray.500">
                    No Reviews
                  </Text>
                ) : (
                  item?.reviews?.map((comment: any) => (
                    <Box
                      key={comment._id}
                      borderBottom="1px"
                      borderColor="gray.200"
                      py={3}
                    >
                      <Flex align="center" mb={2}>
                        <Text fontWeight="bold" mr={2}>
                          {comment.username}
                        </Text>
                        <Flex align="center">
                          {[...Array(Math.floor(comment.rating))].map(
                            (_, index) => (
                              <StarIcon key={index} color="#f59e0b" />
                            )
                          )}
                          <Text ml={2}>{comment.rating?.toFixed(2)}</Text>
                        </Flex>
                      </Flex>
                      <Text mb={2} color="gray.700">
                        {comment.text}
                      </Text>
                      <Text mb={2} color="gray.500">
                        Email: {comment.email}
                      </Text>
                      <Button
                        variant="link"
                        colorScheme="red"
                        review-email={comment.email}
                        onClick={() => {
                          if (!deleteReviewLoading) {
                            deleteReviewMutate(
                              {
                                _id: item?._id,
                                review: {
                                  _id: comment?._id,
                                  isDeleted: true,
                                },
                              },
                              {
                                onSuccess: () => {
                                  toast({
                                    title: `Review deleted successfully`,
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true,
                                  });
                                },
                              }
                            );
                          }
                        }}
                      >
                        <DeleteIcon mr={2} /> Delete Review
                      </Button>
                    </Box>
                  ))
                )}
              </Box>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Layout>
  );
}
