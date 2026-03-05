import { z } from "zod";

export const ZGenerateProductInfoArgs = z.object({
  images: z.array(
    z.object({
      base64: z.base64(),
      mime: z.string(),
    }),
  ),
});
export type GenerateProductInfoArgs = z.infer<typeof ZGenerateProductInfoArgs>;

export const ZAiProductInfo = z.object({
  name: z.string().describe("O noem do produto."),
  brand: z.string().describe("A marca do produto."),
  flavor: z
    .string()
    .optional()
    .describe(
      'O sabor do produto. Exemplo em um suco de laranja, o sabor é "Laranja".',
    ),
  quantityUnit: z
    .enum(["unit", "kg", "g", "mg", "lb", "oz", "ml", "l", "gal"])
    .optional(),
  quantity: z
    .number()
    .optional()
    .describe(
      "A quantidade do produto. Para líquidos, a unidade é litros, mililitros, galões, etc. Alguns produtos são vendidos por peso, então a unidade é quilogramas, gramas, etc. Alguns são vendidos por unidade, então a unidade é o número de unidades.",
    ),
  category: z
    .string()
    .optional()
    .describe(
      "A categoria do produto. Escolha a categoria mais apropriada para o produto.",
    ),
  subCategory: z
    .string()
    .optional()
    .describe(
      "A subcategoria do produto. Escolha a subcategoria mais apropriada para o produto.",
    ),
});
export type AiProductInfo = z.infer<typeof ZAiProductInfo>;
