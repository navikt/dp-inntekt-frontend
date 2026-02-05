import { BodyShort, Box, HStack, Switch } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import { NavLogoIkon } from "./Ikoner/NavLogoIkon";

interface IProps {
  tittel: string;
}

export function Header({ tittel }: IProps) {
  const { setSkjulSensitiveOpplysninger, skjulSensitiveOpplysninger } = useInntekt();

  return (
    <Box background="surface-default" padding="6" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" justify="space-between" align="center">
        <HStack gap="4">
          <NavLogoIkon /> <BodyShort weight="semibold">{tittel}</BodyShort>
        </HStack>
        <Switch
          checked={skjulSensitiveOpplysninger}
          size="small"
          onClick={() => setSkjulSensitiveOpplysninger(!skjulSensitiveOpplysninger)}
          position="right"
        >
          Skjul sensitive opplysninger
        </Switch>
      </HStack>
    </Box>
  );
}
