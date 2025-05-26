export function erEnKvinne(pnr: string) {
  if (!/^\d{11}$/.test(pnr)) {
    throw new Error("Ugyldig pnr. Må være 11 sifre.");
  }

  const individSiffer = parseInt(pnr[8], 10);
  return individSiffer % 2 === 0;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function maskerePersonnummer(pnr: string): string {
  if (pnr.length < 5) return "*".repeat(pnr.length);

  const synlig = pnr.slice(0, pnr.length - 5);
  const maskert = "*".repeat(5);
  return `${synlig} ${maskert}`;
}

export function erPersonnummer(verdi: string): boolean {
  return /^\d{11}$/.test(verdi);
}
