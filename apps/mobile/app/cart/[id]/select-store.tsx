import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Text } from "@/components/ui/text"
import { useMutation, useQuery } from "@tanstack/react-query"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Location from 'expo-location';
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { View } from "react-native"
import { useState } from "react"
import { useTRPC } from "@/lib/trpc";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SelectStore() {
    const [selectCustomStore, setSelectCustomStore] = useState(false)
    const { id: cartId } = useLocalSearchParams<{ id: string }>()
    const trpc = useTRPC()
    const router = useRouter()

    const { mutateAsync: updateStore, isPending: isUpdatingStore } = useMutation(trpc.cart.updateStore.mutationOptions())

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

    if (store && !selectCustomStore) {
        return (
            <SafeAreaView style={{ paddingHorizontal: 24, paddingVertical: 48 }}>
                <Text variant="h1">Você está comprando em:</Text>
                <View style={{ paddingVertical: 48 }}>
                    <View style={{ width: 120, height: 120, marginBottom: 24, marginHorizontal: 'auto', backgroundColor: 'red', borderRadius: 8 }}></View>
                    <Text variant="h4" style={{ textAlign: 'center' }}>{store.name} - {store.city}</Text>
                    <Text variant="muted" style={{ textAlign: 'center' }}>{store.address}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Button onPress={() => setSelectCustomStore(true)} variant="secondary" size="lg" style={{ flex: 1 }}>
                        <Text>Não</Text>
                    </Button>
                    <Button onPress={async () => {
                        await updateStore({
                            cart: { id: cartId },
                            store: { id: store.id },
                        })
                        router.replace(`/cart/${cartId}/scan`)
                    }} size="lg" style={{ flex: 1 }}>
                        <Text>Sim</Text>
                    </Button>
                </View>
            </SafeAreaView>
        )
    }

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