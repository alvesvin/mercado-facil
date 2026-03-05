export class Price {
  constructor(
    public readonly id: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly type: "per_unit" | "per_kg" | "per_l",
  ) {}

  toFloat() {
    return this.price / 100;
  }
}
