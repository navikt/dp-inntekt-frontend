import { BodyShort, Box, Button, HStack } from "@navikt/ds-react";
import { NavLogoIkon } from "./Ikoner/NavLogoIkon";
import { EyeSlashIcon, EyeWithPupilIcon } from "@navikt/aksel-icons";
import { useInntekt } from "~/context/inntekt-context";

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
        <Button
          size="small"
          variant="secondary"
          icon={skjulSensitiveOpplysninger ? <EyeSlashIcon /> : <EyeWithPupilIcon />}
          onClick={() => setSkjulSensitiveOpplysninger(!skjulSensitiveOpplysninger)}
        >
          {skjulSensitiveOpplysninger
            ? "Vis sensitive opplysninger"
            : "Skjul sensitive opplysninger"}
        </Button>
      </HStack>
    </Box>
  );
}
