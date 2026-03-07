import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanWorkflowActorContext } from "@/components/machines/scan-workflow.machine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTRPC } from "@/lib/trpc";

export default function ConfirmPrice() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const { prices, storeId, productId } = ScanWorkflowActorContext.useSelector((state) => ({
    storeId: state.context.cart!.storeId!,
    productId: state.context.product!.id,
    prices: state.context.prices,
  }));

  const inputRef = useRef<TextInput>(null);
  const isNewProduct = false;

  const [value, setValue] = useState(prices.unit?.price ?? 0);

  const trpc = useTRPC();
  const { mutateAsync: createPrice, isPending: isCreatingPrice } = useMutation(
    trpc.price.create.mutationOptions(),
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function onConfirm() {
    let priceId = prices.unit?.id || "";

    if (isNewProduct || !priceId || value !== prices.unit?.price) {
      try {
        const newPrice = await createPrice({
          storeId,
          productId,
          price: value,
          currency: "BRL",
          type: "unit",
        });
        priceId = newPrice.id;
      } catch (error) {
        // TODO: handle error
        // biome-ignore lint/suspicious/noConsole: testing
        console.error(error);
        return;
      }
    }

    actor.send({
      type: "PRICE_CONFIRMED",
      // TODO: handle new price vs accepted price logic
      price: {
        id: priceId,
        price: value,
        currency: "BRL",
        type: "unit",
      },
    });
  }

  function onCancel() {
    actor.send({ type: "PRICE_CANCELLED" });
  }

  return (
    <SafeAreaView className="items-center flex-1 px-10 py-[15vh]">
      <Text variant="h3" className="text-muted-foreground">
        {isNewProduct ? "Digite o valor de varejo" : "Corrija o valor e confirme"}
      </Text>
      <View className="h-[25vh] justify-center">
        <Badge variant="destructive" className="max-w-[60px]">
          <Text>Varejo</Text>
        </Badge>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.5}
          className="text-center text-foreground font-bold text-[25vw]"
          onPress={() => inputRef.current?.focus()}
        >
          {value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <CurrencyInput
          value={value}
          onChangeValue={(value) => setValue(value || 0)}
          renderTextInput={(props) => (
            <TextInput
              {...props}
              autoFocus={isNewProduct}
              ref={inputRef}
              className="text-foreground font-bold text-center w-full [font-size:25vw] invisible absolute z-10"
            />
          )}
        />
      </View>
      <View className="w-full flex-row gap-6">
        <Button
          onPress={onCancel}
          size="lg"
          variant="ghost"
          className="border border-border flex-1"
        >
          <Text>Cancelar</Text>
        </Button>
        <Button disabled={isCreatingPrice} onPress={onConfirm} size="lg" className="flex-1">
          <Text>{isCreatingPrice ? "Confirmando..." : "Confirmar"}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
