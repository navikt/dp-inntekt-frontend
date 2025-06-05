import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";
import type { IVirksomhet } from "~/types/inntekt.types";

interface IInntektContextProps {
  virksomheter: IVirksomhet[];
  globalModalRef?: RefObject<HTMLDialogElement | null>;
}

interface IInntektContextValue {
  inntektEndret: boolean;
  setInntektEndret: (value: boolean) => void;
  klarForLagring: boolean;
  setKlarForLagring: (value: boolean) => void;
  contextVirsomheter: IVirksomhet[];
  setContextViksomheter: (value: IVirksomhet[]) => void;
  globalModalRef: RefObject<HTMLDialogElement | null> | undefined;
}

export const InntektContext = createContext<IInntektContextValue | undefined>(undefined);

function InntektProvider(props: PropsWithChildren<IInntektContextProps>) {
  const [contextVirsomheter, setContextViksomheter] = useState(props.virksomheter || []);
  const [inntektEndret, setInntektEndret] = useState(false);
  const [klarForLagring, setKlarForLagring] = useState(false);

  useEffect(() => {
    // Oppdaterer konteksten hvis virksomheter endres
    if (JSON.stringify(props.virksomheter) !== JSON.stringify(contextVirsomheter)) {
      setContextViksomheter(props.virksomheter);
    }
  }, [props.virksomheter]);

  return (
    <InntektContext.Provider
      value={{
        globalModalRef: props.globalModalRef,
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
