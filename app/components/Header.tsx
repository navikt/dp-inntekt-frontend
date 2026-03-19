import { BodyShort, Box, HStack, Switch, Tag } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import { NavLogoIkon } from "./Ikoner/NavLogoIkon";
import { useInntektSeachParams } from "~/hooks/useInntektSeachParams";

interface IProps {
  tittel: string;
}

export function Header({ tittel }: IProps) {
  const { setSkjulSensitiveOpplysninger, skjulSensitiveOpplysninger } = useInntekt();
  const { readOnly } = useInntektSeachParams();

  return (
    <Box background="surface-default" padding="6" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" justify="space-between" align="center">
        <HStack gap="4">
          <NavLogoIkon /> <BodyShort weight="semibold">{tittel}</BodyShort>
          {readOnly && (
            <Tag variant="info" data-color="info" size="small">
              Lesevisning
            </Tag>
          )}
        </HStack>

        <HStack gap="4">
          <Switch
            checked={skjulSensitiveOpplysninger}
            size="small"
            onClick={() => setSkjulSensitiveOpplysninger(!skjulSensitiveOpplysninger)}
            position="right"
          >
            Skjul sensitive opplysninger
          </Switch>
        </HStack>
      </HStack>
    </Box>
  );
}
