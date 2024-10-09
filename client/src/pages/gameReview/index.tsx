import { StarIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Image,
  Text
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { formatDateFromNow } from "../../_helper/dateFormat";
import { useGameDetails } from "../../api/useGameDetails";
import Layout from "../../components/layout";
import LoadingSkeleton from "../../components/loadingSkeleton";
import "./review.css";
import ReviewForm from "./reviewForm";

export default function Review() {
  const params = useParams();
  const { data, isLoading } = useGameDetails(params?.id || "");

  const avgRating = () => {
    if (data?.reviews?.length === 0) {
      return 0;
    }

    const total = data?.reviews?.reduce(
      (accumulator: number, currentValue: any) => {
        return accumulator + +currentValue.rating;
      },
      0
    );

    return total / data?.reviews?.length;
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (!data && !isLoading) {
    return (
      <Layout>
        <Alert my={4} status="error">
          <AlertIcon />
          <AlertTitle>No Data found</AlertTitle>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-16">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-1">
            <Image
              objectFit="cover"
              src={
                data?.gameImage ||
                "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              }
              alt="Chakra UI"
              height={250}
              className="rounded-lg"
            />

            <Text className="text-protest text-3xl mt-2 mb-2">
              {data?.gameName}
            </Text>

            <Text className="text-black" mt={2}>
              {data?.gameDescription}
            </Text>

            {avgRating() > 0 ? (
              <Flex my={4} alignItems={"center"} className="text-black">
                {[...Array(Math.floor(+avgRating()))]?.map((_) => (
                  <StarIcon mx={"2px"} color="#f59e0b" />
                ))}
                <Text marginLeft={2}>{avgRating()?.toFixed(2)}</Text>

                {data?.reviews?.length > 0 ? (
                  <Text marginLeft={4} color="gray.500">
                    {data?.reviews?.length} Reviews
                  </Text>
                ) : null}
              </Flex>
            ) : null}
          </div>

          <div className="col-span-1 md:col-span-2 md:px-16">
            <ReviewForm gameId={params?.id} />

            <Heading className="text-black" fontSize={"2xl"} mb={2}>
              All Reviews
            </Heading>
            <hr className="border-b-[1px] border-gray-100" />

            {data?.reviews?.map((item: any) => (
              <Box my={10} position={"relative"}>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Box>
                    <Heading size="sm" className="text-black">
                      {item?.username}
                    </Heading>

                    <Text
                      color={"gray.400"}
                      position={"absolute"}
                      top={0}
                      right={0}
                    >
                      {item?.createdAt
                        ? formatDateFromNow(item?.createdAt)
                        : ""}
                    </Text>

                    {+item?.rating > 0 ? (
                      <Flex alignItems={"center"}>
                        {[...Array(Math.floor(+item?.rating))]?.map((_) => (
                          <StarIcon mx={"2px"} color="#f59e0b" />
                        ))}
                        <Text marginLeft={2}>{item?.rating}</Text>
                      </Flex>
                    ) : null}
                  </Box>
                </Flex>
                <Text className="text-black" mt={1}>
                  {item?.text || ""}
                </Text>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
