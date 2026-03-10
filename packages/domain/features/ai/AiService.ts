import type { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { ResultAsync } from "neverthrow";
import type { GenerateProductInfoArgs } from "./types";
import { ZAiProductInfo } from "./types";

const GEN_PRODUCT_INFO_SYSTEM_PROMPT = `Você é um assistente de IA para cadastro de produtos em um mercado. Seu objetivo é identificar as informações do produto a partir das fotos fornecidas.
Você deve retornar as informações do produto em português brasileiro.

Alguns produtos são variações de sabores de um mesmo produto. Nesse caso o nome do produto deve ser o nome do produto principal e o sabor deve ser informado como um complemento. Exemplo: "Café - Caffè Matial" e "Café - Latte Macchiato" são variações de sabores do mesmo produto. O nome do produto deve ser "Café" e o sabor deve ser "Caffè Matial" e "Latte Macchiato".
Alguns produtos são conhecidos pela marca. Exemplo: "Coca-Cola" e "Coca-Cola Zero" são variações de sabores do mesmo produto. O nome do produto deve ser "Coca-Cola" e o sabor deve ser "Zero".

Não inclua o sabor no nome do produto.

O nome do produto deve conter no máximo 2 a 3 palavras.`;

export class AiService {
  constructor(private readonly google: GoogleGenerativeAIProvider) {}

  generateProductInfo(args: GenerateProductInfoArgs) {
    return ResultAsync.fromPromise(
      generateText({
        model: this.google("gemini-3.1-flash-lite-preview"),
        messages: [
          { role: "system", content: GEN_PRODUCT_INFO_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              ...args.images.map(({ base64, mime }) => ({
                type: "image" as const,
                image: base64,
                mediaType: mime,
              })),
              {
                type: "text",
                text: "Gere as informações do produto baseado nas fotos fornecidas.",
              },
            ],
          },
        ],
        output: Output.object({
          schema: ZAiProductInfo,
        }),
      }),
      (error) => error as Error,
    ).map(({ output }) => output);
  }
}
