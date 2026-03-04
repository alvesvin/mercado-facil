import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import { Pressable } from "react-native"
import { CameraIcon } from "phosphor-react-native"
import { api } from "@/lib/api"
import { useRouter } from "expo-router"

export default function IndexStackLayout() {
    const { bottom } = useSafeAreaInsets()
    const router = useRouter()

    async function handleStartCart() {
        const cart = await api.cart.start.mutate().catch(console.error)
        if (!cart) return

        if (cart.storeId) {
            router.navigate(`/cart/${cart.id}/scan`)
        } else {
            router.navigate(`/cart/${cart.id}/select-store`)
        }
    }

    return (
        <Tabs>
            <TabSlot />
            <TabList style={{ paddingBottom: bottom }}>
                <TabTrigger name="index" href="/">
                    <Text>Home</Text>
                </TabTrigger>
                <Pressable onPress={handleStartCart}>
                    <CameraIcon weight='fill' size={28} color="blue" />
                </Pressable>
            </TabList>
        </Tabs>
    )
}