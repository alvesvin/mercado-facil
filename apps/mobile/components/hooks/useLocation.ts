import * as Location from "expo-location";
import { useEffect, useEffectEvent, useState } from "react";

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [permission, setPermission] = useState<Location.LocationPermissionResponse>();
  const [isLoading, setIsLoading] = useState(true);

  const getLocation = useEffectEvent(async () => {
    setIsLoading(true);
    const permission = await Location.requestForegroundPermissionsAsync();
    setPermission(permission);
    if (!permission.granted) {
      setIsLoading(false);
      return;
    }
    const location = await Location.getCurrentPositionAsync();
    setLocation(location);
    setIsLoading(false);
  });

  useEffect(() => {
    getLocation();
  }, []);

  return { location, permission, isLoading, getLocation };
}
