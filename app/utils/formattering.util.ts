import { format } from "date-fns";
import { nb } from "date-fns/locale";

export function formaterNorskDato(dato: string) {
  const formattertDato = format(new Date(dato), "MMMM yyyy", {
    locale: nb,
  });

  return formattertDato.charAt(0).toUpperCase() + formattertDato.slice(1);
}

export function formatterNorskTall(tall: number) {
  if (tall === 0) return "-";

  return `${tall.toLocaleString("no-NO")} kr`;
}
