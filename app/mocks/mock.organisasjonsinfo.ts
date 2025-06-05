export const mockOrganisasjonsinfo = {
  organisasjonsnummer: "123456789",
  navn: "Sharpie ASA",
  organisasjonsform: {
    kode: "FLI",
    beskrivelse: "Forening/lag/innretning",
    _links: {
      self: {
        href: "https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/FLI"
      }
    }
  },
  hjemmeside: "sharpie.no",
  postadresse: {
    land: "Norge",
    landkode: "NO",
    postnummer: "1337",
    poststed: "SANDVIKA",
    adresse: [
      "random address 123"
    ],
    kommune: "BAERUM",
    kommunenummer: "1337"
  },
  registreringsdatoEnhetsregisteret: "2016-01-26",
  registrertIMvaregisteret: false,
  naeringskode1: {
    kode: "94.991",
    beskrivelse: "Aktiviteter i andre interesseorganisasjoner ikke nevnt annet sted"
  },
  harRegistrertAntallAnsatte: false,
  epostadresse: "random@gmail.com",
  mobil: "123 45 678",
  forretningsadresse: {
    land: "Norge",
    landkode: "NO",
    postnummer: "1337",
    poststed: "SANDVIKA",
    adresse: [
      "Random address 123"
    ],
    kommune: "SANDVIKA",
    kommunenummer: "1337"
  },
  stiftelsesdato: "2015-11-01",
  institusjonellSektorkode: {
    kode: "7000",
    beskrivelse: "Ideelle organisasjoner"
  },
  registrertIForetaksregisteret: false,
  registrertIStiftelsesregisteret: false,
  registrertIFrivillighetsregisteret: true,
  konkurs: false,
  underAvvikling: false,
  underTvangsavviklingEllerTvangsopplosning: false,
  maalform: "Bokmål",
  aktivitet: [
    "Testing av organisasjonsinfo for Sharpie AS"
  ],
  registreringsdatoFrivillighetsregisteret: "2022-06-18",
  registrertIPartiregisteret: false,
  paategninger: [],
  _links: {
    self: {
      href: "https://data.brreg.no/enhetsregisteret/api/enheter/123456789"
    }
  },
  respons_klasse: "Enhet"
};