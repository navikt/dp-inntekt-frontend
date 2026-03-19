import navStyles from "@navikt/ds-css/dist/index.css?url";
import { BodyLong, CopyButton, LocalAlert, VStack } from "@navikt/ds-react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import appStyle from "./app.css?url";
import { Header } from "./components/Header";
import { InntektProvider } from "./context/inntekt-context";
import { mockUklassifisertInntekt } from "./mocks/mock.uklassifiert-inntekt";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: navStyles },
  { rel: "stylesheet", href: appStyle },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const location = useLocation();
  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}${location.search}`
      : `${location.pathname}${location.search}`;

  let tittel = "Oops!";
  let feilmelding = "En uventet feil oppstod.";
  let stackTrace: string | undefined;
  let statusKode: number | undefined;

  if (isRouteErrorResponse(error)) {
    statusKode = error.status;
    tittel = error.status === 404 ? "404" : "Error";
    feilmelding =
      error.status === 404
        ? "Fant ikke inntekten. Vennligst sjekk at inntektId, opplysningId og behandlingId er korrekt. Kopiere og sende URL-en under til support for å få hjelp."
        : error.statusText || feilmelding;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    feilmelding = error.message;
    stackTrace = error.stack;
  }

  return (
    <InntektProvider uklassifisertInntekt={mockUklassifisertInntekt} slettModalRef={undefined}>
      <main>
        <VStack gap="6">
          <Header tittel="Dagpenger inntekt" />
          <LocalAlert status="error">
            <LocalAlert.Header>
              <LocalAlert.Title>Teknisk feil {statusKode}</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
              <VStack gap="4" align="start">
                {feilmelding}

                {stackTrace && (
                  <BodyLong>
                    <code>{stackTrace}</code>
                  </BodyLong>
                )}

                <BodyLong className="mt-4" size="small">
                  {fullUrl}
                </BodyLong>
                <CopyButton copyText={fullUrl} text="Kopier lenke" activeText="Kopierte lenke" />
              </VStack>
            </LocalAlert.Content>
          </LocalAlert>
        </VStack>
      </main>
    </InntektProvider>
  );
}
