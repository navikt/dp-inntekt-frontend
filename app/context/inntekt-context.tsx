import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";

interface IInntektContextProps {
  uklassifisertInntekt: IUklassifisertInntekt;
  globalModalRef?: RefObject<HTMLDialogElement | null>;
}

interface IInntektContextValue {
  inntektEndret: boolean;
  setInntektEndret: (value: boolean) => void;
  uklassifisertInntekt: IUklassifisertInntekt;
  setUklassifisertInntekt: (value: IUklassifisertInntekt) => void;
  globalModalRef: RefObject<HTMLDialogElement | null> | undefined;
}

export const InntektContext = createContext<IInntektContextValue | undefined>(undefined);

function InntektProvider(props: PropsWithChildren<IInntektContextProps>) {
  const [uklassifisertInntekt, setUklassifisertInntekt] = useState<IUklassifisertInntekt>(
    props.uklassifisertInntekt
  );
  const [inntektEndret, setInntektEndret] = useState(false);

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
        uklassifisertInntekt,
        setUklassifisertInntekt,
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
