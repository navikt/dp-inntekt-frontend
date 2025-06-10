import { useInntekt } from "~/context/inntekt-context";
import Virksomhet from "./Virksomhet";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";

export function Virksomheter() {
  const { periode } = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const { uklassifisertInntekt } = useInntekt();

  return (
    <>
      {uklassifisertInntekt.virksomheter.map((virksomhet) => (
        <Virksomhet
          key={virksomhet.virksomhetsnummer}
          virksomhet={virksomhet}
          inntektsPeriode={periode}
        />
      ))}
    </>
  );
}
