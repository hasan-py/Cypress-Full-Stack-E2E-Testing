import { ChevronLeftIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAddNewGame } from "../../api/useAddNewGame";
import { useEditGame } from "../../api/useUpdateGame";
import { TextAreaInput } from "../gameReview/textArea";

export function AddGameModal({ editData, setEditData, disclosure }: any) {
  const { isOpen, onOpen, onClose } = disclosure;
  const finalRef = useRef(null);
  const { isLoading, mutate } = useAddNewGame();
  const { isLoading: editLoading, mutate: editMutate } = useEditGame();
  const [gameDescription, setGameDescription] = useState("");
  const [gameImage, setGameImage] = useState("");
  const [gameName, setGameName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const closeModal = () => {
    if (editData) {
      setEditData();
    }
    setErrors({});
    onClose();
  };

  useEffect(() => {
    setGameDescription(editData?.gameDescription || "");
    setGameImage(editData?.gameImage || "");
    setGameName(editData?.gameName || "");
  }, [editData]);

  const resetFormData = () => {
    setGameDescription("");
    setGameImage("");
    setGameName("");
    setErrors({});
  };

  const gameSchema = z.object({
    gameName: z.string().min(1, "Game Name must be provided"),
    gameImage: z.string().url("Game Image must be a valid URL"),
    gameDescription: z.string().min(1, "Description must be provided"),
  });

  const validateForm = () => {
    const result = gameSchema.safeParse({
      gameName,
      gameImage,
      gameDescription,
    });

    if (!result.success) {
      const errObj: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errObj[`${err.path[0]?.toString()}`] = err.message;
      });
      setErrors(errObj);
      return false;
    }

    setErrors({});
    return true;
  };

  const submitHandler = () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      gameName,
      gameDescription,
      gameImage,
    };

    if (editData) {
      editMutate(
        { _id: editData?._id, ...payload },
        {
          onSuccess: () => {
            resetFormData();
            toast({
              title: `Game update successfully`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            closeModal();
          },
          onError: (err: any) => {
            toast({
              title: err?.response?.data?.error || "Something went wrong",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    } else {
      mutate(payload, {
        onSuccess: () => {
          resetFormData();
          toast({
            title: `Game created successfully`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          closeModal();
        },
        onError: (err: any) => {
          toast({
            title: err?.response?.data?.error || "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      });
    }
  };

  return (
    <>
      <Flex p={8} justifyContent={"space-between"} alignItems={"center"} mb={2}>
        <div
          onClick={() => navigate("/admin")}
          className="flex items-center text-blue-500 cursor-pointer text-4xl"
        >
          <ChevronLeftIcon color={"blue.500"} />
          <span className="text-lg font-bold">Back</span>
        </div>

        <button
          type="button"
          onClick={onOpen}
          id="add-game-button"
          className="px-4 py-2 rounded-full text-black bg-yellow-500"
        >
          <SmallAddIcon fontSize={20} />
          Add Game
        </button>
      </Flex>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent bg="black">
          <ModalHeader className="text-gray-100">
            {!editData ? "Create" : "Edit"} Game
          </ModalHeader>
          <ModalCloseButton className="text-gray-200" />
          <ModalBody>
            <Box>
              <Input
                value={gameName}
                onChange={(e: any) => setGameName(e.target.value)}
                placeholder="Game Name"
                variant={"flushed"}
                color="white"
                borderColor={errors.gameName ? "red.500" : "gray.700"}
              />
              <Text fontSize={12} color={"red.500"}>
                {errors?.gameName}
              </Text>

              <Input
                value={gameImage}
                onChange={(e: any) => setGameImage(e.target.value)}
                placeholder="Game Image (URL Only)"
                variant={"flushed"}
                color="white"
                borderColor={errors.gameImage ? "red.500" : "gray.700"}
              />
              <Text fontSize={12} color={"red.500"}>
                {errors?.gameImage}
              </Text>

              <TextAreaInput
                value={gameDescription}
                setValue={setGameDescription}
                placeholder="Game description..."
                borderColor={errors.gameImage ? "red.500" : "gray.700"}
              />
              <Text fontSize={12} color={"red.500"}>
                {errors?.gameDescription}
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              onClick={submitHandler}
              size="md"
              mx={1}
              id="save-button-add-game"
              disabled={isLoading || editLoading}
              colorScheme="green"
            >
              Save
            </Button>

            <Button
              size="md"
              color={"white"}
              mx={1}
              variant={"outline"}
              mr={3}
              id="cancel-button-add-game"
              onClick={closeModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
