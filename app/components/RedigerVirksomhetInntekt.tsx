import { NotePencilIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useRef } from "react";
import type { IInntekt, IVirksomhet } from "~/types/inntekt.types";
import RedigerModal from "./LeggTilInntektsKilde/RedigerInntektModal";

interface IProps {
  virksomhet: IVirksomhet;
  formDefaultValues: {
    beskrivelse: string;
    inntektskilde: string;
    inntekter: IInntekt[];
  };
}

export function RedigerVirksomhetInntekt({ virksomhet, formDefaultValues }: IProps) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        variant="tertiary"
        size="small"
        icon={<NotePencilIcon />}
        onClick={() => ref.current?.showModal()}
      />
      <RedigerModal ref={ref} virksomhet={virksomhet} formDefaultValues={formDefaultValues} />
    </>
  );
}
