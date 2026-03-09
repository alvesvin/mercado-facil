import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { Config, Effect, Either } from "effect";
import type { GenerateProductInfoArgs } from "./types";
import { ZAiProductInfo } from "./types";

const GEN_PRODUCT_INFO_SYSTEM_PROMPT = `Você é um assistente de IA para cadastro de produtos em um mercado. Seu objetivo é identificar as informações do produto a partir das fotos fornecidas.
Você deve retornar as informações do produto em português brasileiro.

Alguns produtos são variações de sabores de um mesmo produto. Nesse caso o nome do produto deve ser o nome do produto principal e o sabor deve ser informado como um complemento. Exemplo: "Café - Caffè Matial" e "Café - Latte Macchiato" são variações de sabores do mesmo produto. O nome do produto deve ser "Café" e o sabor deve ser "Caffè Matial" e "Latte Macchiato".
Alguns produtos são conhecidos pela marca. Exemplo: "Coca-Cola" e "Coca-Cola Zero" são variações de sabores do mesmo produto. O nome do produto deve ser "Coca-Cola" e o sabor deve ser "Zero".

Não inclua o sabor no nome do produto.

O nome do produto deve conter no máximo 2 a 3 palavras.`;

export class AiService extends Effect.Service<AiService>()("AiService", {
  effect: Effect.gen(function* () {
    const apiKey = yield* Config.string("GOOGLE_GENERATIVE_AI_API_KEY");
    const google = createGoogleGenerativeAI({ apiKey });

    return {
      generateProductInfo: (args: GenerateProductInfoArgs) =>
        Effect.gen(function* () {
          yield* Effect.logInfo("Generating product info");

          const result = yield* Effect.tryPromise(() =>
            generateText({
              model: google("gemini-3.1-flash-lite-preview"),
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
          ).pipe(Effect.either);

          if (Either.isLeft(result)) {
            yield* Effect.logError("Failed to generate product info", result.left.error);
            return null;
          } else {
            yield* Effect.logInfo("Product info generated successfully");
            return result.right.output;
          }
        }).pipe(Effect.withLogSpan("generateProductInfo")),
    };
  }),
}) {}
