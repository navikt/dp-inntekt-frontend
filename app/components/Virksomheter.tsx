import { useInntekt } from "~/context/inntekt-context";
import Virksomhet from "./Virksomhet";

export function Virksomheter() {
  const { uklassifisertInntekt } = useInntekt();

  return (
    <>
      {uklassifisertInntekt.virksomheter.map((virksomhet) => (
        <Virksomhet key={virksomhet.virksomhetsnummer} virksomhet={virksomhet} />
      ))}
    </>
  );
}
