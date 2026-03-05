import ScannerOverlay from "@/components/ScannerOverlay"
import { api } from "@/lib/api"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useRef } from "react"
import { StyleSheet, type GestureResponderEvent } from "react-native"
import { Camera, useCameraPermission, useCameraDevice, useCodeScanner, type Point, type Code } from 'react-native-vision-camera'
import * as Haptics from 'expo-haptics'

const SCREEN_OPTIONS = {
    title: 'Cart Scan',
    headerShown: false,
}

export default function CartScan() {
    const { id: cartId } = useLocalSearchParams<{ id: string }>()

    const camera = useRef<Camera>(null)
    const device = useCameraDevice('back')
    const { hasPermission } = useCameraPermission()
    const scanned = useRef(false)
    const router = useRouter()

    const onCodeScanned = useCallback(async ([code]: Code[]) => {
        if (!code.value) return
        if (scanned.current) return
        scanned.current = true
        const product = await api.product.findByBarcode.query({ barcode: code.value })
        if (!product) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
            router.replace(`/cart/${cartId}/register-product?barcode=${code.value}`)
            return
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        router.replace(`/cart/${cartId}/confirm-price?productId=${product.id}`)
        scanned.current = false
    }, [])

    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13'],
        onCodeScanned
    })

    if (!hasPermission) return null
    if (!device) return null

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <Camera ref={camera} device={device} style={StyleSheet.absoluteFill} isActive codeScanner={codeScanner} />
            <ScannerOverlay />
        </>
    )
}