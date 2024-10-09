import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { ChevronLeftIcon, StarIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
  Stat,
  StatGroup,
  StatLabel,
  Text,
} from "@chakra-ui/react";
import { Map } from "leaflet";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { RefObject, useRef } from "react";
import LoadingSkeleton from "../../components/loadingSkeleton";
import { useMapData } from "../../api/useMapData";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout";

const locations = [
  { name: "Central Park, New York City", lat: 40.7829, lng: -73.9654 },
  { name: "Hollywood Walk of Fame, Los Angeles", lat: 34.1014, lng: -118.3256 },
  { name: "Navy Pier, Chicago", lat: 41.8917, lng: -87.6043 },
  { name: "Pike Place Market, Seattle", lat: 47.6097, lng: -122.3416 },
  { name: "Golden Gate Park, San Francisco", lat: 37.7694, lng: -122.4862 },
];

const resizeMap = (mapRef: RefObject<Map>) => {
  const resizeObserver = new ResizeObserver(() =>
    mapRef.current?.invalidateSize()
  );

  const container = document.getElementById("map-container");
  if (container) {
    resizeObserver.observe(container);
  }
};

export default function MapView(props: any) {
  const { data, isLoading } = useMapData();
  const navigate = useNavigate();
  const mapRef = useRef<Map>(null);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (data?.length === 0) {
    return (
      <Alert my={4} status="error">
        <AlertIcon />
        <AlertTitle>No Data for map</AlertTitle>
      </Alert>
    );
  }

  return (
    <Layout>
      <Flex justifyContent={"space-between"} alignItems={"center"} mb={2}>
        <div
          onClick={() => navigate("/admin")}
          className="flex items-center p-8 text-blue-500 cursor-pointer text-4xl"
        >
          <ChevronLeftIcon color={"blue.500"} />
          <span className="text-lg font-bold">Back</span>
        </div>
      </Flex>

      <div>
        <div id="map">
          <MapContainer
            ref={mapRef}
            id="map-container"
            whenReady={() => resizeMap(mapRef)}
            center={[locations[0].lat, locations[0].lng]}
            zoom={0}
            style={{ height: "500px", width: "100wh" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {data?.map((item: any) => (
              <Marker
                position={[item?.reviews?.latitude, item?.reviews?.longitude]}
              >
                <Popup minWidth={150}>
                  <StatGroup>
                    <Stat>
                      <StatLabel fontWeight={"bold"}>
                        {item?.gameName}
                      </StatLabel>
                      <StatLabel>{item?.reviews.username}</StatLabel>
                      <StatLabel>{item?.reviews.email}</StatLabel>

                      {item?.reviews ? (
                        <Flex alignItems={"center"}>
                          {[...Array(+item?.reviews?.rating)]?.map((star) => (
                            <StarIcon
                              marginRight={1}
                              type="increase"
                              color="yellow.500"
                            />
                          ))}
                          <Text fontWeight={"bold"}>
                            {item?.reviews.rating}
                          </Text>
                        </Flex>
                      ) : null}
                    </Stat>
                  </StatGroup>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <Text color="gray.500">Please zoom in/out for better view</Text>
        </div>
      </div>
    </Layout>
  );
}
