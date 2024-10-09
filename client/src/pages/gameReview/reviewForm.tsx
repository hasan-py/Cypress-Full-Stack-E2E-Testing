import { Alert, AlertIcon, Box, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCommentReview } from "../../api/useCommentReview";
import "./review.css";
import { TextAreaInput } from "./textArea";

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default function ReviewForm({ gameId }: any) {
  const [rating, setRating] = useState(null);
  const [textArea, setTextArea] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { isSuccess, isLoading, mutate } = useCommentReview();

  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const position = await getLocation();
        setLocation(position);
      } catch (error) {
        setError(
          "Location is required! Please turn on your browser for this tab!"
        );
      }
    }
    fetchData();
  }, []);

  const resetFormData = () => {
    setTextArea("");
    setEmail("");
    setName("");
    setRating(null);
  };

  const errorCheck = () => {
    if (!name) {
      setError("Name must be provided");
      return true;
    }
    if (!email) {
      setError("Email must be provided");
      return true;
    }
    if (!rating) {
      setError("Rating must be provided");
      return true;
    }
    if (!textArea) {
      setError("Comment must be provided");
      return true;
    }
    return false;
  };

  const submitHandler = () => {
    if (errorCheck()) {
      return;
    }

    mutate(
      {
        _id: gameId,
        review: {
          text: textArea,
          username: name,
          email: email,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          rating: rating,
        },
      },
      {
        onSuccess: () => {
          resetFormData();
        },
        onError: (err: any) => {
          setError(err?.data?.response?.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <>
      {isSuccess ? (
        <Alert my={4} status="success">
          <AlertIcon />
          {"Thank you for your review!"}
        </Alert>
      ) : (
        <Flex flexDirection={"column"} my={8}>
          <Text className="text-white">Write a comment </Text>

          <Box>
            <Input
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              my={2}
              placeholder="Name"
              variant={"flushed"}
              borderColor={"gray.400"}
            />
            <Input
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              mt={2}
              mb={4}
              placeholder="Email"
              variant={"flushed"}
              borderColor={"gray.400"}
            />
            <TextAreaInput
              value={textArea}
              variant={"flushed"}
              setValue={setTextArea}
              color={"black"}
              borderColor={"gray.400"}
            />
          </Box>

          <Box mb={2}>
            <fieldset
              onChange={(e: any) => setRating(e.target?.value)}
              className="rating"
            >
              <input
                type="radio"
                className="rating"
                id="star5"
                name="rating"
                defaultValue={5}
              />
              <label
                className="full"
                htmlFor="star5"
                title="Awesome - 5 stars"
              />
              <input
                type="radio"
                className="rating"
                id="star4"
                name="rating"
                defaultValue={4}
              />
              <label
                className="full"
                htmlFor="star4"
                title="Pretty good - 4 stars"
              />
              <input
                type="radio"
                className="rating"
                id="star3"
                name="rating"
                defaultValue={3}
              />
              <label className="full" htmlFor="star3" title="Meh - 3 stars" />
              <input
                type="radio"
                className="rating"
                id="star2"
                name="rating"
                defaultValue={2}
              />
              <label
                className="full"
                htmlFor="star2"
                title="Kinda bad - 2 stars"
              />
              <input
                type="radio"
                className="rating"
                id="star1"
                name="rating"
                defaultValue={1}
              />
              <label
                className="full"
                htmlFor="star1"
                title="Sucks big time - 1 star"
              />
            </fieldset>
          </Box>

          {error ? <p className="text-red-500 mb-4">{error}</p> : null}

          <Box>
            <button
              disabled={isLoading}
              type="button"
              id="submit-review-button"
              onClick={() => submitHandler()}
              className="rounded-full px-8 py-2 bg-yellow-500 text-black font-bold uppercase"
            >
              Submit
            </button>
          </Box>
        </Flex>
      )}
    </>
  );
}
