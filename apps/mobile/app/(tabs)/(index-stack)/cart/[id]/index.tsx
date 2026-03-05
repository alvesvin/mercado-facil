import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useLocalSearchParams } from "expo-router"

export default function Cart() {
    const { id } = useLocalSearchParams<{ id: string }>()
    return (
        <View>
            <Text>Cart</Text>
        </View>
    )
}