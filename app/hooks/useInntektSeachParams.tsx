import { useSearchParams } from "react-router";

type InntektSearchParams = {
  opplysningId: string | null;
  behandlingId: string | null;
  erArena: boolean;
  readOnly: boolean;
};

export function useInntektSeachParams(): InntektSearchParams {
  let [searchParams] = useSearchParams();

  const opplysningId = searchParams.get("opplysningId");
  const behandlingId = searchParams.get("behandlingId");
  const erArena = searchParams.get("erArena") === "true";
  const readOnly = searchParams.get("readOnly") === "true";

  return {
    opplysningId,
    behandlingId,
    erArena,
    readOnly,
  };
}
