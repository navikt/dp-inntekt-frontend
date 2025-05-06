import { describe, it, expect } from "vitest";
import { erEnKvinne } from "./generell.util";

describe("erEnKvinne", () => {
  it("returnerer true for kvinne-personnummer (partall i 9. siffer)", () => {
    expect(erEnKvinne("01010112460")).toBe(true); // 9. siffer = 4
    expect(erEnKvinne("12029312682")).toBe(true); // 9. siffer = 6
    expect(erEnKvinne("30050012804")).toBe(true); // 9. siffer = 8
    expect(erEnKvinne("01010112230")).toBe(true); // 9. siffer = 2
  });

  it("returnerer false for mann-personnummer (oddetall i 9. siffer)", () => {
    expect(erEnKvinne("01010112351")).toBe(false); // 9. siffer = 5
    expect(erEnKvinne("01010112373")).toBe(false); // 9. siffer = 7
    expect(erEnKvinne("01010112395")).toBe(false); // 9. siffer = 9
    expect(erEnKvinne("01010112331")).toBe(false); // 9. siffer = 3
  });

  it("kaster feil hvis personnummeret ikke har 11 sifre", () => {
    expect(() => erEnKvinne("1234567890")).toThrowError("Ugyldig pnr. Må være 11 sifre.");
    expect(() => erEnKvinne("123456789012")).toThrowError("Ugyldig pnr. Må være 11 sifre.");
    expect(() => erEnKvinne("abcdefghijk")).toThrowError("Ugyldig pnr. Må være 11 sifre.");
    expect(() => erEnKvinne("")).toThrowError("Ugyldig pnr. Må være 11 sifre.");
  });
});
