import { useSearchParams } from "react-router";

type InntektSearchParams = {
  opplysningTypeId: string | null;
  behandlingId: string | null;
  erArena: boolean;
  readOnly: boolean;
  inntektLagret: boolean;
};

export function useInntektSeachParams(): InntektSearchParams {
  let [searchParams] = useSearchParams();

  const opplysningTypeId = searchParams.get("opplysningId");
  const behandlingId = searchParams.get("behandlingId");
  const erArena = searchParams.get("erArena") === "true";
  const readOnly = searchParams.get("readOnly") === "true";
  const inntektLagret = searchParams.get("inntektLagret") === "true";

  return {
    opplysningTypeId,
    behandlingId,
    erArena,
    readOnly,
    inntektLagret,
  };
}
