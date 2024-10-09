import { Spinner } from "@chakra-ui/react";

export default function LoadingSkeleton() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner color="yellow.500" />
    </div>
  );
}
