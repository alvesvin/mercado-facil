import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { CameraIcon } from "phosphor-react-native";
import { Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RegisterNewProductForm } from "@/components/RegisterNewProductForm";

export default function RegisterProduct() {
    const { id: cartId, barcode } = useLocalSearchParams<{ id: string; barcode: string }>();
    const router = useRouter()
    const [frontImage, setFrontImage] = useState<ImagePicker.ImagePickerAsset>();
    const [backImage, setBackImage] = useState<ImagePicker.ImagePickerAsset>();
    const trpc = useTRPC()

    const { data: cart, isLoading: isLoadingCart } = useQuery(trpc.cart.findById.queryOptions({ id: cartId }))

    const { mutateAsync: generateProductInfo, isPending: isGeneratingProductInfo } = useMutation(trpc.ai.generateProductInfo.mutationOptions())
    const [aiProductInfo, setAiProductInfo] = useState<Awaited<ReturnType<typeof generateProductInfo>>>();

    const { mutateAsync: registerNewProduct, isPending: isRegisteringNewProduct } = useMutation(trpc.cart.reigsterNewProductSaga.mutationOptions())

    useEffect(() => {
        if (!frontImage || !backImage || aiProductInfo !== undefined) return;
        generateProductInfo({
            images: [
                {
                    base64: frontImage.base64 || '',
                    mime: frontImage.mimeType || 'image/jpeg',
                },
                {
                    base64: backImage.base64 || '',
                    mime: backImage.mimeType || 'image/jpeg',
                },
            ]
        }).then(setAiProductInfo)
    }, [frontImage, backImage, aiProductInfo])

    console.log(cart)

    if (isLoadingCart || !cart) return null;

    if (isGeneratingProductInfo) return <Text>Gerando informações do produto...</Text>

    if (aiProductInfo !== undefined) {
        return (
            <SafeAreaView className="p-6 flex-1">
                <Text variant="h3" className="mb-2">Informações do produto</Text>
                <Text variant="muted">Revise as informações do produto.</Text>

                <RegisterNewProductForm
                    initialValues={{
                        name: aiProductInfo?.name,
                        brand: aiProductInfo?.brand,
                        flavor: aiProductInfo?.flavor,
                        quantity: aiProductInfo?.quantity,
                        quantityUnit: aiProductInfo?.quantityUnit && {
                            label: aiProductInfo.quantityUnit,
                            value: aiProductInfo.quantityUnit,
                        },
                        category: aiProductInfo?.category,
                        subCategory: aiProductInfo?.subCategory,
                    }}
                    onSubmit={async (values) => {
                        await registerNewProduct({
                            cartId,
                            storeId: cart.storeId || undefined,
                            price: {
                                value: Math.round(values.price.value * 100),
                                currency: values.price.currency,
                                type: values.price.type.value,
                            },
                            product: {
                                barcode,
                                name: values.name,
                                brand: values.brand,
                                flavor: values.flavor,
                                quantity: values.quantity,
                                quantityUnit: values.quantityUnit.value,
                                category: values.category,
                                subCategory: values.subCategory,
                            }
                        })
                        router.replace(`/cart/${cartId}`)
                    }}
                />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="p-6">
            <Text variant="h3" className="mb-2">Tire fotos do produto.</Text>
            <Text variant="muted">Uou! Você encontrou um produto não cadastrado no sistema.</Text>

            <View className="py-12 gap-8">
                <Pressable onPress={async () => {
                    const result = await ImagePicker.launchCameraAsync({
                        base64: true,
                    });
                    if (result.canceled) return;
                    if (result.assets?.[0]) {
                        setFrontImage(result.assets[0]);
                    }
                }}>
                    <View>
                        <Label className="mb-2">Foto da frente</Label>
                        <View className="border-2 border-muted-foreground border-dashed h-[100px] rounded-lg items-center justify-center">
                            {frontImage ? <Image source={{ uri: frontImage.uri }} className="w-full h-full" /> : (
                                <>
                                    <Icon as={CameraIcon} weight="duotone" className="text-muted-foreground size-8" />
                                    <Text className="text-muted-foreground">Toque para adicionar a foto</Text>
                                </>
                            )}
                        </View>
                    </View>
                </Pressable>

                <Pressable onPress={async () => {
                    const result = await ImagePicker.launchCameraAsync({
                        base64: true,
                    });
                    if (result.canceled) return;
                    if (result.assets?.[0]) {
                        setBackImage(result.assets[0]);
                    }
                }}>
                    <View>
                        <Label className="mb-2">Foto de trás</Label>
                        <View className="border-2 border-muted-foreground border-dashed h-[100px] rounded-lg items-center justify-center">
                            {backImage ? <Image source={{ uri: backImage.uri }} className="w-full h-full" /> : (
                                <>
                                    <Icon as={CameraIcon} weight="duotone" className="text-muted-foreground size-8" />
                                    <Text className="text-muted-foreground">Toque para adicionar a foto</Text>
                                </>
                            )}
                        </View>
                    </View>
                </Pressable>

                {/* <View>
                    <Label style={{ marginBottom: 6 }}>Nome do produto</Label>
                    <Input placeholder="Macarrão instantâneo" />
                </View>

                <View>
                    <Label style={{ marginBottom: 6 }}>Marca</Label>
                    <Input placeholder="Nissin" />
                </View>

                <Separator style={{ marginTop: 16 }} />

                <View>
                    <Label style={{ marginBottom: 6 }}>Nome do produto</Label>
                    <Input placeholder="Nome do produto" />
                </View> */}
            </View>
        </SafeAreaView>
    )
}