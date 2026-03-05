import { ScrollView, View } from "react-native";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import CurrencyInput from 'react-native-currency-input'
import { Controller, useForm, useFormState, type DeepPartial } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

const ZRegisterNewProductFormSchema = z.object({
    price: z.object({
        value: z.any(),
        currency: z.string().default('BRL'),
        type: z.object({
            label: z.string(),
            value: z.enum(['unit', 'per_kg', 'per_l'])
        }),
    }),
    name: z.string().min(1),
    brand: z.string().min(1),
    flavor: z.string().optional(),
    quantity: z.number().int().positive().min(1),
    quantityUnit: z.object({
        label: z.string(),
        value: z.enum(['unit', 'kg', 'g', 'mg', 'l', 'ml', 'lb', 'oz', 'gal']),
    }),
    category: z.string().optional(),
    subCategory: z.string().optional(),
})
type RegisterNewProductFormSchema = z.infer<typeof ZRegisterNewProductFormSchema>

type Props = {
    initialValues?: Partial<RegisterNewProductFormSchema>
    onSubmit: (values: RegisterNewProductFormSchema) => void | Promise<void>
}

export function RegisterNewProductForm(props: Props) {
    const { initialValues, onSubmit } = props;

    const form = useForm({
        resolver: zodResolver(ZRegisterNewProductFormSchema),
        defaultValues: {
            ...initialValues,
            price: {}
        },
    })

    const { control, handleSubmit } = form
    const { errors } = useFormState({ control })
    console.log(JSON.stringify(errors, null, 2))

    return (
        <>
            <ScrollView className="py-12 flex-1">
                <View className="gap-6">
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Label className="mb-2">Preço</Label>
                            <Controller
                                control={control}
                                name="price.value"
                                render={({ field }) => {
                                    return (
                                        <CurrencyInput
                                            value={field.value}
                                            onChangeValue={(value) => field.onChange(value || 0)}
                                            onBlur={field.onBlur}
                                            prefix="R$ "
                                            delimiter="."
                                            separator=","
                                            precision={2}
                                            minValue={0}
                                            renderTextInput={Input}
                                        />
                                    )
                                }} />
                        </View>
                        <View className="flex-1">
                            <Label className="mb-2">Tipo</Label>
                            <Controller
                                control={control}
                                name="price.type"
                                render={({ field }) => {
                                    return (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem label="Por unidade" value="unit">Por unidade</SelectItem>
                                                <SelectItem label="Por quilo" value="per_kg">Por quilo</SelectItem>
                                                <SelectItem label="Por litro" value="per_l">Por litro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )
                                }}
                            />
                        </View>
                    </View>
                    <Separator className="mt-2" />
                    <View>
                        <Label className="mb-2">Nome do produto</Label>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => {
                                return (
                                    <Input {...field} placeholder="Macarrão instantâneo" />
                                )
                            }}
                        />
                    </View>
                    <View>
                        <Label className="mb-2">Marca</Label>
                        <Controller
                            control={control}
                            name="brand"
                            render={({ field }) => {
                                return (
                                    <Input {...field} placeholder="Nissin" />
                                )
                            }}
                        />
                    </View>
                    <View>
                        <Label className="mb-2">Sabor (opcional)</Label>
                        <Controller
                            control={control}
                            name="flavor"
                            render={({ field }) => {
                                return (
                                    <Input {...field} placeholder="Limão" />
                                )
                            }}
                        />
                    </View>
                    <Separator className="mt-2" />
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Label className="mb-2">Tamanho</Label>
                            <Controller
                                control={control}
                                name="quantity"
                                render={({ field }) => {
                                    return (
                                        <CurrencyInput
                                            value={field.value}
                                            onChangeValue={(value) => field.onChange(value || 0)}
                                            onBlur={field.onBlur}
                                            precision={0}
                                            renderTextInput={Input}
                                            keyboardType="numeric"
                                            inputMode="numeric"
                                            placeholder="200"
                                        />
                                    )
                                }}
                            />
                        </View>
                        <View className="flex-1 self-end">
                            <Controller
                                control={control}
                                name="quantityUnit"
                                render={({ field }) => {
                                    return (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem label="Unidade" value="unit">Unidade</SelectItem>
                                                <SelectItem label="Kilograma" value="kg">Kilograma</SelectItem>
                                                <SelectItem label="Grama" value="g">Grama</SelectItem>
                                                <SelectItem label="Miligrama" value="mg">Miligrama</SelectItem>
                                                {/* <SelectItem label="Libra" value="lb">Libra</SelectItem>
                                    <SelectItem label="Onça" value="oz">Onça</SelectItem> */}
                                                <SelectItem label="Litro" value="l">Litro</SelectItem>
                                                <SelectItem label="Mililitro" value="ml">Mililitro</SelectItem>
                                                {/* <SelectItem label="Galão" value="gal">Galão</SelectItem> */}
                                            </SelectContent>
                                        </Select>
                                    )
                                }}
                            />
                        </View>
                    </View>
                    <Separator className="mt-2" />
                    <View>
                        <Label className="mb-2">Categoria</Label>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => {
                                return (
                                    <Input {...field} placeholder="Alimentos" />
                                )
                            }}
                        />
                    </View>
                    <View>
                        <Label className="mb-2">Subcategoria</Label>
                        <Controller
                            control={control}
                            name="subCategory"
                            render={({ field }) => {
                                return (
                                    <Input {...field} placeholder="Macarrão" />
                                )
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
            <View className="py-2">
                <Button onPress={handleSubmit(onSubmit)}>
                    <Text>Cadastrar produto</Text>
                </Button>
            </View>
        </>
    )
}