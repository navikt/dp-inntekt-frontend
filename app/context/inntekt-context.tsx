import { createContext, useContext, useState, type PropsWithChildren } from "react";

interface IInntektContext {
  endret: boolean;
  setEndret: (value: boolean) => void;
  klarForLagring: boolean;
  setKlarForLagring: (value: boolean) => void;
}

interface IInitialState {
  endret: boolean;
}

export const InntektContext = createContext<IInntektContext | undefined>(undefined);

function InntektProvider(props: PropsWithChildren<IInitialState>) {
  const [endret, setEndret] = useState<boolean>(props.endret);
  const [klarForLagring, setKlarForLagring] = useState<boolean>(false);

  return (
    <InntektContext.Provider
      value={{
        endret,
        setEndret,
        klarForLagring,
        setKlarForLagring,
      }}
    >
      {props.children}
    </InntektContext.Provider>
  );
}

function useInntekt() {
  const context = useContext(InntektContext);

  if (!context) {
    throw new Error("useInntekt must be used within a UserInfoProvider");
  }

  return context;
}

export { InntektProvider, useInntekt };
