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
  contextVirksomheter: IVirksomhet[];
  setContextVirksomheter: (value: IVirksomhet[]) => void;
  globalModalRef: RefObject<HTMLDialogElement | null> | undefined;
  contextPayload: string | null;
  setContextPayload: (value: string | null) => void;
}

export const InntektContext = createContext<IInntektContextValue | undefined>(undefined);

function InntektProvider(props: PropsWithChildren<IInntektContextProps>) {
  const [contextVirksomheter, setContextVirksomheter] = useState(props.virksomheter || []);
  const [inntektEndret, setInntektEndret] = useState(false);
  const [contextPayload, setContextPayload] = useState<string | null>(null);
  const [klarForLagring, setKlarForLagring] = useState(false);

  // For å forhindre at brukeren kan navigere bort fra siden uten å lagre endringer
  useEffect(() => {
    if (!inntektEndret) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Nødvendig for å vise dialogen i de fleste nettlesere
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [inntektEndret]);

  return (
    <InntektContext.Provider
      value={{
        globalModalRef: props.globalModalRef,
        inntektEndret,
        setInntektEndret,
        klarForLagring,
        setKlarForLagring,
        contextVirksomheter,
        setContextVirksomheter,
        contextPayload,
        setContextPayload,
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
