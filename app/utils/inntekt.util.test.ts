import { describe, expect, it } from "vitest";
import type { IInntekt, IVirksomhet } from "~/types/inntekt.types";
import {
  beregnTotalInntektForEnPeriode,
  inntektsPeriodeEr36Maneder,
  sumTotaltInntekterForAlleVirksomheter,
  summerInntekterPerManed,
} from "./inntekt.util";

describe("sumTotaltInntekterForAlleVirksomheter", () => {
  const lagVirksomhet = (inntekter: Partial<IInntekt>[]): Partial<IVirksomhet> => ({
    inntekter: inntekter as IInntekt[],
  });

  it("summerer heltall på tvers av virksomheter", () => {
    const virksomheter = [
      lagVirksomhet([{ belop: "1000" }, { belop: "2000" }]),
      lagVirksomhet([{ belop: "500" }]),
    ];

    expect(sumTotaltInntekterForAlleVirksomheter(virksomheter as IVirksomhet[])).toBe(3500);
  });

  it("summerer desimaler med punktum", () => {
    const virksomheter = [lagVirksomhet([{ belop: "1000.50" }, { belop: "500.25" }])];

    expect(sumTotaltInntekterForAlleVirksomheter(virksomheter as IVirksomhet[])).toBe(1500.75);
  });

  it("summerer desimaler med komma", () => {
    const virksomheter = [lagVirksomhet([{ belop: "1000,50" }, { belop: "500,25" }])];

    expect(sumTotaltInntekterForAlleVirksomheter(virksomheter as IVirksomhet[])).toBe(1500.75);
  });

  it("summerer desimaler på tvers av virksomheter", () => {
    const virksomheter = [
      lagVirksomhet([{ belop: "1200,50" }, { belop: "300,25" }]),
      lagVirksomhet([{ belop: "400,75" }]),
    ];

    expect(sumTotaltInntekterForAlleVirksomheter(virksomheter as IVirksomhet[])).toBe(1901.5);
  });

  it("returnerer 0 for tom virksomhetsliste", () => {
    expect(sumTotaltInntekterForAlleVirksomheter([])).toBe(0);
  });

  it("returnerer 0 for virksomhet uten inntekter", () => {
    const virksomheter = [lagVirksomhet([])];

    expect(sumTotaltInntekterForAlleVirksomheter(virksomheter as IVirksomhet[])).toBe(0);
  });
});

describe("beregnTotalInntektForEnPeriode", () => {
  const periode = { fraOgMed: "2023-01", tilOgMed: "2023-03" };

  it("summerer heltall innenfor perioden", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "1000", aarMaaned: "2023-01" },
      { belop: "2000", aarMaaned: "2023-02" },
      { belop: "500", aarMaaned: "2023-03" },
    ];

    expect(beregnTotalInntektForEnPeriode(inntekter as IInntekt[], periode)).toBe(3500);
  });

  it("summerer desimaler med punktum", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "1000.50", aarMaaned: "2023-01" },
      { belop: "500.25", aarMaaned: "2023-02" },
    ];

    expect(beregnTotalInntektForEnPeriode(inntekter as IInntekt[], periode)).toBeCloseTo(1500.75);
  });

  it("summerer desimaler med komma", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "1000,50", aarMaaned: "2023-01" },
      { belop: "500,25", aarMaaned: "2023-02" },
    ];

    expect(beregnTotalInntektForEnPeriode(inntekter as IInntekt[], periode)).toBeCloseTo(1500.75);
  });

  it("ekskluderer inntekter utenfor perioden", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "1000", aarMaaned: "2022-12" },
      { belop: "2000", aarMaaned: "2023-01" },
      { belop: "500", aarMaaned: "2023-04" },
    ];

    expect(beregnTotalInntektForEnPeriode(inntekter as IInntekt[], periode)).toBe(2000);
  });

  it("returnerer 0 for tom inntektsliste", () => {
    expect(beregnTotalInntektForEnPeriode([], periode)).toBe(0);
  });

  it("returnerer 0 når ingen inntekter er innenfor perioden", () => {
    const inntekter: Partial<IInntekt>[] = [
      { belop: "1000", aarMaaned: "2022-01" },
      { belop: "2000", aarMaaned: "2024-01" },
    ];

    expect(beregnTotalInntektForEnPeriode(inntekter as IInntekt[], periode)).toBe(0);
  });
});

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
