export function erEnKvinne(pnr: string) {
  if (!/^\d{11}$/.test(pnr)) {
    throw new Error("Ugyldig pnr. Må være 11 sifre.");
  }

  const individSiffer = parseInt(pnr[8], 10);

  return individSiffer % 2 === 0;
}
