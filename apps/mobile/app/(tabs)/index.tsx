import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { Separator } from "@/components/ui/separator";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { ShoppingCartIcon } from "phosphor-react-native";

export default function HomePage() {
  const { top } = useSafeAreaInsets();

  const trpc = useTRPC();
  const {
    data: carts,
    refetch: refetchCarts,
    isRefetching: isRefetchingCarts,
  } = useQuery(trpc.cart.index.queryOptions({}));

  return (
    <>
      <View style={{ paddingTop: top + 8 }} className="flex-row pb-4">
        <Text variant="h4" className="text-center flex-1">
          Histórico de Compras
        </Text>
      </View>

      <FlashList
        data={carts}
        className="pt-2 px-6"
        ItemSeparatorComponent={() => <Separator className="mt-1 mb-2" />}
        onRefresh={() => refetchCarts()}
        refreshing={isRefetchingCarts}
        renderItem={({ item }) => (
          <Link href="/">
            <View className="flex-row gap-2">
              <View className="size-12 rounded-lg bg-muted items-center justify-center">
                <Icon as={ShoppingCartIcon} className="text-muted-foreground size-6 shrink-0" />
              </View>
              <View className="">
                <Text>
                  {item.store?.name} {item.itemsCount} itens
                </Text>
                <Text variant="muted">
                  {formatRelative(item.createdAt, new Date(), { locale: ptBR })}
                </Text>
              </View>
            </View>
          </Link>
        )}
      />
    </>
  );
}
