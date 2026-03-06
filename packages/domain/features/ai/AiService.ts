import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { Effect, Either } from "effect";
import type { GenerateProductInfoArgs } from "./types";
import { ZAiProductInfo } from "./types";

export class AiService extends Effect.Service<AiService>()("AiService", {
  effect: Effect.gen(function* () {
    return {
      generateProductInfo: (args: GenerateProductInfoArgs) =>
        Effect.gen(function* () {
          const result = yield* Effect.tryPromise(() =>
            generateText({
              model: google("gemini-3.1-flash-lite-preview"),
              messages: [
                {
                  role: "system",
                  content: `Você é um assistente de IA para cadastro de produtos em um mercado. Seu objetivo é identificar as informações do produto a partir das fotos fornecidas.
Você deve retornar as informações do produto em português brasileiro.

Alguns produtos são variações de sabores de um mesmo produto. Nesse caso o nome do produto deve ser o nome do produto principal e o sabor deve ser informado como um complemento. Exemplo: "Café - Caffè Matial" e "Café - Latte Macchiato" são variações de sabores do mesmo produto. O nome do produto deve ser "Café" e o sabor deve ser "Caffè Matial" e "Latte Macchiato".
Alguns produtos são conhecidos pela marca. Exemplo: "Coca-Cola" e "Coca-Cola Zero" são variações de sabores do mesmo produto. O nome do produto deve ser "Coca-Cola" e o sabor deve ser "Zero".

Não inclua o sabor no nome do produto.

O nome do produto deve conter no máximo 2 a 3 palavras.`,
                },
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
          ).pipe(Effect.either);

          if (Either.isLeft(result)) {
            return null;
          } else {
            return result.right.output;
          }
        }),
    };
  }),
}) {}
