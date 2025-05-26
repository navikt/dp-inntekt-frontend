import { format } from "date-fns";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { lagreInntekt } from "~/models/inntekt.server";
import type { IInntekt, IVirksomhetsinntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/_index";
import { inntektTyperBeskrivelse } from "~/utils/constants";

interface IFormDataInntek {
  dato: string;
  belop: string;
}

// Lagring av inntekten
// Denne funksjonen håndterer lagring av inntekten når brukeren sender inn skjemaet
export async function action({ request, params }: Route.ActionArgs) {
  invariant(params.inntektId, "Mangler inntekts-ID");

  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());
  const organisasjonsnummer = entries["organisasjonsnummer"] as string;
  const organisasjonsnavn = entries["organisasjonsnavn"] as string;
  const inntektstype = entries["inntektstype"] as string;
  const originalData = entries["originalData"] as string;
  const inntektskilde = entries["inntektskilde"] as string;

  const inntekter = hentFormDataInntekter();

  function hentFormDataInntekter(): IFormDataInntek[] {
    const {
      inntektskilde,
      organisasjonsnavn,
      organisasjonsnummer,
      inntektstype,
      originalData,
      ...rest
    } = entries;

    return Object.entries(rest).map(([key, value]) => {
      const [dato] = key.split("_");
      return {
        dato: format(dato, "yyyy-MM"),
        belop: value.toString(),
      };
    });
  }

  function lagNyInntektskilde(): IVirksomhetsinntekt {
    const datoer = inntekter.map((i) => i.dato).sort();
    const tidligste = datoer[0];
    const seneste = datoer[datoer.length - 1];
    const totalBelop = inntekter.reduce((sum, i) => sum + Number(i.belop), 0);

    return {
      virksomhetsnummer: organisasjonsnummer,
      virksomhetsnavn: organisasjonsnavn,
      periode: { fra: tidligste, til: seneste },
      inntekter: lagNyInntektskildeInntekter(),
      totalBelop: totalBelop.toString(),
      avvikListe: [],
    };
  }

  function lagNyInntektskildeInntekter(): IInntekt[] {
    const virksomhet = { aktoerType: inntektskilde, identifikator: organisasjonsnummer };

    // Todo: Finn ut om mottaker alltid er en person!
    const inntektsmottaker = {
      aktoerType: "NATURLIG_IDENT",
      identifikator: organisasjonsnummer,
    };

    return inntekter.map(({ dato, belop }) => ({
      belop: belop.toString(),
      fordel: "",
      beskrivelse:
        inntektTyperBeskrivelse.find((type) => type.key === inntektstype)?.key || inntektstype,
      inntektskilde: "",
      inntektsstatus: "",
      inntektsperiodetype: "Maaned",
      leveringstidspunkt: dato,
      utbetaltIMaaned: dato,
      virksomhet,
      inntektsmottaker,
      inngaarIGrunnlagForTrekk: true,
      utloeserArbeidsgiveravgift: true,
      informasjonsstatus: "",
      inntektType: "",
      redigert: false,
      begrunnelse: "",
      aarMaaned: dato,
      opptjeningsland: "", 
      opptjeningsperiode: "", 
      skattemessigBosattLand: "", 
      opplysningspliktig: null,
      inntektsinnsender: null, 
      tilleggsinformasjon: null
    }));
  }

  const parsedOriginalData = JSON.parse(originalData);
  const nyInntektskilde = lagNyInntektskilde();

  const oppdaterteInntektData = {
    ...parsedOriginalData,
    virksomhetsinntekt: [nyInntektskilde, ...parsedOriginalData.virksomhetsinntekt],
  };

  const lagreInntektResponse = await lagreInntekt(request, params.inntektId, oppdaterteInntektData);

  if (!lagreInntektResponse.ok) {
    throw new Response("Feil ved lagring av inntekt", {
      status: lagreInntektResponse.status,
      statusText: lagreInntektResponse.statusText,
    });
  }

  const nyInntektId = await lagreInntektResponse.text();

  return redirect(`/inntektId/${nyInntektId}`);
}
