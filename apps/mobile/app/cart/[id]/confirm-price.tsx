import { Text } from "@/components/ui/text"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams } from "expo-router"
import { useTRPC } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export default function ConfirmPrice() {
    const { id: cartId, productId } = useLocalSearchParams<{ id: string; productId: string }>()
    const trpc = useTRPC()

    const { data: cart, isLoading: isLoadingCart } = useQuery(trpc.cart.findById.queryOptions({ id: cartId }))

    const { data: consensus, isLoading: isLoadingConsensus } = useQuery({
        queryKey: ['price', 'findConsensus', productId, cart?.storeId],
        queryFn: async () => {
            if (!productId || !cart?.storeId) return;
            return await api.price.findConsensus.query({ productId, storeId: cart.storeId })
        },
        enabled: !!productId && !!cart?.storeId,
    })

    if (isLoadingCart || !cart) return null;

    console.log(consensus)

    return (
        <SafeAreaView>
            <Text>ConfirmPrice</Text>
            <Text>{JSON.stringify({ consensus, cart }, null, 2)}</Text>
        </SafeAreaView>
    )
}