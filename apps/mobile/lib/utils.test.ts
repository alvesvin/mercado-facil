import { formatDistance } from "./utils";

describe("formatDistance", () => {
  it("should format distance in meters", () => {
    expect(formatDistance(100)).toBe("100m");
  });

  it("should format distance in kilometers", () => {
    expect(formatDistance(1000)).toBe("1.0 km");
  });
});
