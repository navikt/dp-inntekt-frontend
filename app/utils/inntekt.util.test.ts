import { inntektsPeriodeEr36Maneder } from "./inntekt.util";
import { describe, it, expect } from "vitest";

describe("inntektsPeriodeEr36Maneder", () => {
  it("returnerer true for nøyaktig 36 måneder", () => {
    expect(inntektsPeriodeEr36Maneder({ fraOgMed: "2022-01", tilOgMed: "2024-12" })).toBe(true); // 2022-01 til 2024-12 er 36 måneder
  });

  it("returnerer false for mindre enn 36 måneder", () => {
    expect(inntektsPeriodeEr36Maneder({ fraOgMed: "2022-01", tilOgMed: "2024-11" })).toBe(false);
  });

  it("returnerer false for mer enn 36 måneder", () => {
    expect(inntektsPeriodeEr36Maneder({ fraOgMed: "2021-12", tilOgMed: "2024-12" })).toBe(false);
  });

  it("returnerer false hvis fraOgMed og tilOgMed er samme måned", () => {
    expect(inntektsPeriodeEr36Maneder({ fraOgMed: "2022-01", tilOgMed: "2022-01" })).toBe(false);
  });
});
