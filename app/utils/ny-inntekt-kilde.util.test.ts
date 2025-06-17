import { describe, expect, it } from "vitest";
import {
  finnTidligsteOgSenesteDato,
  finnTotalBelop,
  lagInntektListe,
  type IFormInntekt,
} from "./ny-inntekt-kilde.util";

describe("finnTidligsteOgSenesteDato", () => {
  it("finner tidligste og seneste dato i en liste", () => {
    const formInntekter: IFormInntekt[] = [
      { dato: "2023-05", belop: "1000" },
      { dato: "2022-01", belop: "1000" },
      { dato: "2024-03", belop: "1000" },
    ];

    const inntekter = lagInntektListe("Lønn", "Arbeidsgiver", "123456789", formInntekter);

    expect(finnTidligsteOgSenesteDato(inntekter)).toEqual({
      fraOgMed: "2022-01",
      tilOgMed: "2024-03",
    });
  });

  it("fungerer med bare én inntekt", () => {
    const enFormInntekt: IFormInntekt[] = [{ dato: "2023-01", belop: "1000" }];
    const inntekter = lagInntektListe("Lønn", "Arbeidsgiver", "123456789", enFormInntekt);

    expect(finnTidligsteOgSenesteDato(inntekter)).toEqual({
      fraOgMed: "2023-01",
      tilOgMed: "2023-01",
    });
  });
});

describe("finnTotalBelop", () => {
  it("summerer alle beløp og returnerer som string", () => {
    const formInntekter: IFormInntekt[] = [
      { dato: "2023-01", belop: "1000" },
      { dato: "2023-02", belop: "2000" },
      { dato: "2023-03", belop: "300" },
    ];

    const inntekter = lagInntektListe("Lønn", "Arbeidsgiver", "123456789", formInntekter);

    expect(finnTotalBelop(inntekter)).toBe("3300");
  });
});
