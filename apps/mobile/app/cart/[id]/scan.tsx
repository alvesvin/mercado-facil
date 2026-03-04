import { CameraView, useCameraPermissions } from "expo-camera"
import { Stack, useLocalSearchParams } from "expo-router"
import { StyleSheet } from "react-native"

const SCREEN_OPTIONS = {
    title: 'Cart Scan',
    headerShown: false,
}

export default function CartScan() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const [cameraPermission, requestCameraPermission] = useCameraPermissions()

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <CameraView style={StyleSheet.absoluteFill} />
        </>
    )
}