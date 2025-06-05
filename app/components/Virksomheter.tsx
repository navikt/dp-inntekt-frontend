import { useInntekt } from "~/context/inntekt-context";
import Virksomhet from "./Virksomhet";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { useEffect } from "react";

export function Virksomheter() {
  const { periode } = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const { contextVirksomheter, setContextViksomheter, setInntektEndret } = useInntekt();

  function slettVirksomhetInntekt (virksomhetsnummer: string) {
    setInntektEndret(true)
    var oppdatertKontekstVirksomheter = contextVirksomheter.filter(virksomhet => virksomhet.virksomhetsnummer !== virksomhetsnummer)
    setContextViksomheter(oppdatertKontekstVirksomheter)
  }

  useEffect(() => {
    console.log("UseEffect", contextVirksomheter)
  }, [contextVirksomheter])


  return (
    <>
      {contextVirksomheter.map((virksomhet) => (
        <Virksomhet
          key={virksomhet.virksomhetsnummer}
          virksomhet={virksomhet}
          inntektsPeriode={periode}
          slettVirksomhet={slettVirksomhetInntekt}
        />
      ))}
    </>
  );
}
