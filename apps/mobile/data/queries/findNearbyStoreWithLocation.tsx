import { queryOptions } from "@tanstack/react-query";
import * as Location from "expo-location";
import { api } from "@/lib/api";

export const findNearbyStoreWithLocationQueryOptions = queryOptions({
  queryKey: ["store", "find-nearby"],
  queryFn: async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return null;
    const location = await Location.getCurrentPositionAsync();
    return await api.store.findNear.query({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  },
});
