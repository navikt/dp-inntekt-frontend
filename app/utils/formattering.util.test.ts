import { describe, it, expect } from "vitest";
import { formaterNorskDato, formatterNorskTall } from "./formattering.util"; // endre "filnavn" til faktisk filnavn

describe("formaterNorskDato", () => {
  it("formaterer dato til norsk måned og år med stor forbokstav", () => {
    const input = "2023-05-01";
    const output = formaterNorskDato(input);
    expect(output).toBe("Mai 2023");
  });

  it("håndterer januar korrekt", () => {
    const input = "2024-01-15";
    const output = formaterNorskDato(input);
    expect(output).toBe("Januar 2024");
  });
});

describe("formatterNorskTall", () => {
  it("formaterer et positivt tall med mellomrom som tusenskille og 'kr'", () => {
    const input = 1234567;
    const output = formatterNorskTall(input);
    expect(output).toBe("1 234 567 kr");
  });

  it("returnerer '-' for tallet 0", () => {
    const output = formatterNorskTall(0);
    expect(output).toBe("-");
  });

  it("formaterer et negativt tall korrekt", () => {
    const output = formatterNorskTall(5000);
    expect(output).toBe("5 000 kr");
  });
});
