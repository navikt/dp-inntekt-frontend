import { BodyShort, Box, HStack, Switch, Tag } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import { useInntektSeachParams } from "~/hooks/useInntektSeachParams";
import { NavLogoIkon } from "./Ikoner/NavLogoIkon";

interface IProps {
  tittel: string;
}

export function Header({ tittel }: IProps) {
  const { setSkjulSensitiveOpplysninger, skjulSensitiveOpplysninger } = useInntekt();
  const { readOnly } = useInntektSeachParams();

  return (
    <Box background="default" padding="space-24" borderRadius="12" borderColor="neutral-subtle">
      <HStack gap="space-16" justify="space-between" align="center">
        <HStack gap="space-16">
          <NavLogoIkon /> <BodyShort weight="semibold">{tittel}</BodyShort>
          {readOnly && (
            <Tag variant="outline" data-color="info" size="small">
              Lesevisning
            </Tag>
          )}
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
