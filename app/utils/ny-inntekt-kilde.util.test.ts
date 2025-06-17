import { describe, it, expect } from "vitest";
import {
  finnTidligsteOgSenesteDato,
  finnTotalBelop,
  type IFormInntekt,
} from "./ny-inntekt-kilde.util";

describe("finnTidligsteOgSenesteDato", () => {
  it("finner tidligste og seneste dato i en liste", () => {
    const inntekter: IFormInntekt[] = [
      { dato: "2023-05", belop: "1000" },
      { dato: "2022-01", belop: "1000" },
      { dato: "2024-03", belop: "1000" },
    ];

    expect(finnTidligsteOgSenesteDato(inntekter)).toEqual({
      fraOgMed: "2022-01",
      tilOgMed: "2024-03",
    });
  });

  it("fungerer med bare én inntekt", () => {
    const enInntekt: IFormInntekt[] = [{ dato: "2023-01", belop: "1000" }];

    expect(finnTidligsteOgSenesteDato(enInntekt)).toEqual({
      fraOgMed: "2023-01",
      tilOgMed: "2023-01",
    });
  });
});

describe("finnTotalBelop", () => {
  it("summerer alle beløp og returnerer som string", () => {
    const inntekter: IFormInntekt[] = [
      { dato: "2023-01", belop: "1000" },
      { dato: "2023-02", belop: "2000" },
      { dato: "2023-03", belop: "300" },
    ];

    expect(finnTotalBelop(inntekter)).toBe("3300");
  });
});
