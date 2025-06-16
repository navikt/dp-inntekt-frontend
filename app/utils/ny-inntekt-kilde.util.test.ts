import { describe, it, expect } from "vitest";
import { finnTidligsteOgSenesteDato } from "./ny-intekt-kilde.util";

describe("finnTidligsteOgSenesteDato", () => {
  it("finner tidligste og seneste dato i en liste", () => {
    const inntekter = [{ dato: "2023-05" }, { dato: "2022-01" }, { dato: "2024-03" }] as any;

    expect(finnTidligsteOgSenesteDato(inntekter)).toEqual({
      fraOgMed: "2022-01",
      tilOgMed: "2024-03",
    });
  });

  it("fungerer med bare én inntekt", () => {
    const inntekter = [{ dato: "2023-01" }] as any;
    expect(finnTidligsteOgSenesteDato(inntekter)).toEqual({
      fraOgMed: "2023-01",
      tilOgMed: "2023-01",
    });
  });

  it("returnerer undefined hvis listen er tom", () => {
    const inntekter: any[] = [];
    expect(finnTidligsteOgSenesteDato(inntekter)).toEqual({
      fraOgMed: undefined,
      tilOgMed: undefined,
    });
  });
});
