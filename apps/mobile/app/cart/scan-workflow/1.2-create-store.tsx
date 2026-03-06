import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";
import { useLocation } from "@/components/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useTRPC } from "@/lib/trpc";
import { ScanWorkflowActorContext } from "./_scan-workflow.machine";

const ZCreateStoreFormSchema = z.object({
  name: z.string().min(3),
});
type CreateStoreFormSchema = z.infer<typeof ZCreateStoreFormSchema>;

export default function CreateStore() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const { location } = useLocation();

  const form = useForm({
    resolver: zodResolver(ZCreateStoreFormSchema),
  });
  const { handleSubmit, control } = form;

  const trpc = useTRPC();
  const { mutate: createStore, isPending: isCreatingStore } = useMutation(
    trpc.store.create.mutationOptions(),
  );

  function onSubmit(values: CreateStoreFormSchema) {
    createStore(
      {
        ...values,
        latitude: location?.coords.latitude ?? 0,
        longitude: location?.coords.longitude ?? 0,
      },
      {
        onSuccess: (data) => {
          actor.send({ type: "STORE_FOUND", store: { id: data.id } });
        },
      },
    );
  }

  return (
    <SafeAreaView>
      <Text variant="h1" className="text-left text-balance mt-6 px-6">
        Qual o nome da loja que você está comprando?
      </Text>

      <View className="p-6">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              {...field}
              onChangeText={field.onChange}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Digite o nome da loja"
              className="h-14 mb-6"
            />
          )}
        />

        <View className="flex-row gap-x-4">
          <Button
            disabled={isCreatingStore}
            variant="ghost"
            size="lg"
            className="flex-1 border border-border"
          >
            <Text>Cancelar</Text>
          </Button>
          <Button
            disabled={isCreatingStore}
            size="lg"
            className="flex-1"
            onPress={handleSubmit(onSubmit)}
          >
            <Text>Continuar</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
