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
  slettModalRef?: RefObject<HTMLDialogElement | null>;
}

export type slettType = "VIRKSOMHET" | "INNTEKTSKILDE" | undefined;

interface IInntektContextValue {
  inntektEndret: boolean;
  setInntektEndret: (value: boolean) => void;
  uklassifisertInntekt: IUklassifisertInntekt;
  setUklassifisertInntekt: (value: IUklassifisertInntekt) => void;
  slettModalRef: RefObject<HTMLDialogElement | null> | undefined;
  slettBekreftet: boolean;
  setSlettBekreftet: (value: boolean) => void;
  slettType: slettType;
  setSlettType: (value: slettType) => void;
}

export const InntektContext = createContext<IInntektContextValue | undefined>(undefined);

function InntektProvider(props: PropsWithChildren<IInntektContextProps>) {
  const [uklassifisertInntekt, setUklassifisertInntekt] = useState<IUklassifisertInntekt>(
    props.uklassifisertInntekt
  );
  const [inntektEndret, setInntektEndret] = useState(false);
  const [slettBekreftet, setSlettBekreftet] = useState(false);
  const [slettType, setSlettType] = useState<slettType>(undefined);

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
        slettModalRef: props.slettModalRef,
        inntektEndret,
        setInntektEndret,
        uklassifisertInntekt,
        setUklassifisertInntekt,
        slettBekreftet,
        setSlettBekreftet,
        slettType,
        setSlettType,
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
