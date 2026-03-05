import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import { Pressable, View } from "react-native"
import { CameraIcon } from "phosphor-react-native"
import { api } from "@/lib/api"
import { useRouter } from "expo-router"
import { Dimensions } from "react-native"
import { Button } from "@/components/ui/button"

const { width } = Dimensions.get('screen')

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
            <TabList style={{ paddingBottom: bottom }} className="border-t bg-muted/20 h-20">
                <TabTrigger name="index" href="/" style={{ width: width / 3 }} className="items-center justify-center">
                    <Text>Home</Text>
                </TabTrigger>

                <Pressable onPress={handleStartCart} style={{ width: width / 3 }} className="items-center justify-center">
                    {/* <View >
                    </View> */}

                    <View className="absolute size-20">
                        <Button
                            className="w-full h-full bg-background rounded-full items-center justify-center"
                            size="icon"
                            variant="ghost"
                        >
                            <CameraIcon weight='fill' size={40} color="blue" />
                        </Button>
                        <View className="-inset-1 -z-10 rounded-full absolute" style={{
                            backgroundColor: 'linear-gradient(to bottom, red, blue)'
                        }} />
                    </View>

                </Pressable>

                <View style={{ width: width / 3 }} />
            </TabList>
        </Tabs>
    )
}