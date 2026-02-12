import { describe, expect, it } from "vitest";
import type { IInntekt } from "~/types/inntekt.types";
import { inntektsPeriodeEr36Maneder, summerInntekterPerManed } from "./inntekt.util";

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

describe("summerInntekterPerManed", () => {
  it("summerer inntekter for samme måned", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "4896.0", aarMaaned: "2024-12" },
      { belop: "10608.0", aarMaaned: "2024-12" },
    ];

    const resultat = summerInntekterPerManed(inntekter as IInntekt[]);

    expect(resultat["2024-12"]).toBe("15504");
  });

  it("håndterer flere inntekter for forskjellige måneder", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "4896.0", aarMaaned: "2024-12" },
      { belop: "10608.0", aarMaaned: "2024-12" },
      { belop: "11424.0", aarMaaned: "2025-01" },
      { belop: "6528.0", aarMaaned: "2025-01" },
    ];

    const resultat = summerInntekterPerManed(inntekter as IInntekt[]);

    expect(resultat["2024-12"]).toBe("15504");
    expect(resultat["2025-01"]).toBe("17952");
  });

  it("håndterer flere inntekter for samme måned", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "7344.0", aarMaaned: "2025-02" },
      { belop: "5222.0", aarMaaned: "2025-02" },
      { belop: "3264.0", aarMaaned: "2025-02" },
      { belop: "2984.0", aarMaaned: "2025-02" },
    ];

    const resultat = summerInntekterPerManed(inntekter as IInntekt[]);

    expect(resultat["2025-02"]).toBe("18814");
  });

  it("håndterer enkeltinntekt", () => {
    const inntekter: Partial<IInntekt>[] = [{ belop: "3730.0", aarMaaned: "2025-12" }];

    const resultat = summerInntekterPerManed(inntekter as IInntekt[]);

    expect(resultat["2025-12"]).toBe("3730");
  });

  it("håndterer tom liste", () => {
    const resultat = summerInntekterPerManed([]);

    expect(resultat).toEqual({});
  });
});
