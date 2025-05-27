import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { IVirksomhetsinntekt } from "~/types/inntekt.types";

interface IInntektContextProps {
  virksomheter: IVirksomhetsinntekt[];
}

interface IInntektContextValue {
  inntektEndret: boolean;
  setInntektEndret: (value: boolean) => void;
  klarForLagring: boolean;
  setKlarForLagring: (value: boolean) => void;
  contextVirsomheter: IVirksomhetsinntekt[];
  setContextViksomheter: (value: IVirksomhetsinntekt[]) => void;
}

export const InntektContext = createContext<IInntektContextValue | undefined>(undefined);

function InntektProvider(props: PropsWithChildren<IInntektContextProps>) {
  const [contextVirsomheter, setContextViksomheter] = useState(props.virksomheter || []);
  const [inntektEndret, setInntektEndret] = useState(false);
  const [klarForLagring, setKlarForLagring] = useState(false);

  return (
    <InntektContext.Provider
      value={{
        inntektEndret,
        setInntektEndret,
        klarForLagring,
        setKlarForLagring,
        contextVirsomheter,
        setContextViksomheter,
      }}
    >
      {props.children}
    </InntektContext.Provider>
  );
}

function useInntekt() {
  const context = useContext(InntektContext);

  if (!context) {
    throw new Error("useInntekt must be used within a InntektProvider");
  }

  return context;
}

export { InntektProvider, useInntekt };
