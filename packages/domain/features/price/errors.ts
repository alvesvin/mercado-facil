import { FlowInvarianceError } from "@mercado-facil/errors";

export class CreatePriceForProductTodayError extends FlowInvarianceError {
  constructor(message: string = "Você já criou um preço para este produto hoje") {
    super({ message });
  }
}
CreatePriceForProductTodayError.prototype.name = "CreatePriceForProductTodayError";

export class TooManyPricesForStoreTodayError extends FlowInvarianceError {
  constructor(message: string = "Você alcançou o limite de 10 lojas por dia") {
    super({ message });
  }
}
TooManyPricesForStoreTodayError.prototype.name = "TooManyPricesForStoreTodayError";
