import { StarIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function GameCard({ item }: { item: any }) {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => {
          navigate(`review/${item?._id}`);
        }}
        className="hover:-translate-y-1 hover:scale-110 cursor-pointer rounded"
      >
        <div className="relative">
          <Image
            objectFit="cover"
            width={"100%"}
            className="rounded-lg"
            height={200}
            src={
              item?.gameImage ||
              "https://cdn.mos.cms.futurecdn.net/jSAqsHHfjKpGqDfvG5Ccqe-1200-80.jpg.webp"
            }
            alt={"Game Image"}
          />
          {item?.reviews?.length > 0 ? (
            <div className="absolute bottom-0 right-0 bg-white flex item-center shadow-xl px-2 py-1 m-2 rounded-full">
              {[...Array(Math.floor(+item?.avgRating))]?.map((_) => (
                <StarIcon mx={"1px"} color="#f59e0b" />
              ))}
              <span className="text-xs font-bold ml-1 mr-1">
                {+item?.avgRating?.toFixed(2)}
              </span>
            </div>
          ) : null}
        </div>

        <p className="text-protest text-lg text-black truncate">
          {item?.gameName}
        </p>
        <p className="truncate text-sm text-gray-800">
          {item?.gameDescription}
        </p>
        <p className="text-xs truncate text-red-500">
          {item?.reviews?.length || "No"} Reviews
        </p>
      </div>
    </>
  );
}

// <Stack>
//   <CardBody>
//     <Heading size="md">{item?.gameName}</Heading>

//     <Text my="2" noOfLines={3}>
//       {item?.gameDescription}
//     </Text>
//   </CardBody>

//   <CardFooter>
//     <Flex w="full" justifyContent={'space-between'}>
//       {item?.reviews?.length > 0 ? (
//         <Flex alignItems={'center'}>
//           {[...Array(Math.floor(+item?.avgRating))]?.map((_) => (
//             <StarIcon mx={'2px'} color="#f59e0b" />
//           ))}
//           <Text marginLeft={2}>{+item?.avgRating?.toFixed(2)}</Text>

//           {item?.reviews?.length > 0 ? (
//             <Text marginLeft={4} color="gray.500">
//               {item?.reviews?.length} Reviews
//             </Text>
//           ) : null}
//         </Flex>
//       ) : (
//         <Flex>
//           <Text color="gray.500">No reviews</Text>
//         </Flex>
//       )}

//       <Button
//         ml={4}
//         onClick={() => {
//           navigate(`review/${item?._id}`)
//         }}
//         colorScheme="red"
//       >
//         See all
//       </Button>
//     </Flex>
//   </CardFooter>
// </Stack>
