import React from "react";
import ErrorScreen from "../features/error/screens/ErrorScreen";
import { useCurrentPosition } from "../features/map/hooks/useCurrentPosition";
import MapScreen from "../features/map/screens/MapScreen";
import SplashScreen from "../features/splash/screens/SplashScreen";

export default function Index() {
    const { location, loading, hasPermission, requestPermission } = useCurrentPosition();

    if (loading) {
        return <SplashScreen />;
    }

    if (hasPermission === false) {
        return <ErrorScreen onRetry={requestPermission} />;
    }

    return <MapScreen latitude={location?.latitude} longitude={location?.longitude} />;
}
