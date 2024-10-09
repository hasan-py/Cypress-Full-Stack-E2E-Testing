import { Text } from "@chakra-ui/react";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Admin from "./moderator";
import Home from "./gameList";
import Login from "./auth";
import Review from "./gameReview";
import { getLocalStorageData } from "../_helper/localstorage";
import MapView from "./moderator/mapView";
import GamesTable from "./moderator/gameList";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = getLocalStorageData("token");

  if (!token) {
    return children;
  }
  return <Navigate to="/admin" />;
};

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = getLocalStorageData("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default function Pages() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review/:id" element={<Review />} />

          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GamesTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="*"
            element={<Text textAlign={"center"}>404 Not found</Text>}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
