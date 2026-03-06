import { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductScanMachineContext } from "./ProductScanMachineContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export function ConfirmPrice() {
  const inputRef = useRef<TextInput>(null);
  const isNewProduct = ProductScanMachineContext.useSelector(
    (state) => state.context.product.isNew,
  );
  const price = ProductScanMachineContext.useSelector((state) => state.context.price);
  const actoreRef = ProductScanMachineContext.useActorRef();

  const [value, setValue] = useState(price?.value ?? 0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function onConfirm() {
    actoreRef.send({
      type: "product.price.confirmed",
      price: {
        value,
        currency: "BRL",
        type: "unit",
      },
    });
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
        <Button size="lg" variant="ghost" className="border border-border flex-1">
          <Text>Cancelar</Text>
        </Button>
        <Button onPress={onConfirm} size="lg" variant="secondary" className="flex-1">
          <Text>Confirmar</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
