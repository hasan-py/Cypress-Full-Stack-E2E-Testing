import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useGameList } from "../../api/useGameList";
import Layout from "../../components/layout";
import LoadingSkeleton from "../../components/loadingSkeleton";
import GameCard from "./gameCard";
import Hero from "../../components/hero";

export default function Home() {
  const { isLoading, data } = useGameList();

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
      <Hero />

      {!isLoading && data?.length > 0 ? (
        <div className="pb-16 m-16 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-8">
          {data?.map((item: any) => (
            <div className="col-span-1">
              <GameCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center  w-1/2">
            <Alert mt={20} mb={4} status="error" className="rounded-full">
              <AlertIcon />
              <AlertTitle>No game listed</AlertTitle>
              <AlertDescription>Only Moderator can list game</AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </Layout>
  );
}
