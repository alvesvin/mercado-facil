import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Text } from "@/components/ui/text"
import { useTRPC } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Location from 'expo-location';
import { api } from "@/lib/api"

export default function SelectStore() {
    const trpc = useTRPC()

    const { data: store, isLoading } = useQuery({
        queryKey: ['store', 'findNear'],
        queryFn: async () => {
            const permission = await Location.requestForegroundPermissionsAsync()
            if (!permission.granted) return;
            const location = await Location.getCurrentPositionAsync()
            return await api.store.findNear.query({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            })
        },
    })

    if (isLoading) return null;

    return (
        <SafeAreaView>
            <Text variant="h1">
                Onde você está comprando?
            </Text>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione uma loja" />
                </SelectTrigger>
            </Select>
        </SafeAreaView>
    )
}