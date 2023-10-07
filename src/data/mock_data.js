let MEDERWERKERS = [
  {
    id: 1,
    naam: "Vandekerckhove",
    voornaam: "Brecht",
    dienst: "L24u",
  },
  {
    id: 2,
    naam: "Balcaen",
    voornaam: "Melissa",
    dienst: "L24u",
  },
];

let BESTELLINGEN = [
  {
    bestellingsnr: 1,
    besteldatum: "2023-10-01T00:00:00.000Z",
    medewerker: {
      id: 1,
      naam: "Vandekerckhove",
      voornaam: "Brecht",
      dienst: "L24u",
    },
    maaltijden: [
      {
        id: 1,
        leverdatum: "2023-10-07T00:00:00.000Z",
        hoofdschotel: "lasagne",
        soep: true,
        dessert: "zuivel",
      },
      {
        id: 2,
        leverdatum: "2023-10-08T00:00:00.000Z",
        typeSandwiches: "bruin",
        hartigBeleg: "hesp",
        zoetBeleg: "choco",
        vetstof: true,
        soep: false,
        dessert: "fruit",
      },
    ],
  },
  {
    bestellingsnr: 2,
    besteldatum: "2023-10-03T00:00:00.000Z",
    medewerker: {
      id: 2,
      naam: "Balcaen",
      voornaam: "Melissa",
      dienst: "L24u",
    },
    maaltijden: [
      {
        id: 3,
        leverdatum: "2023-10-07T00:00:00.000Z",
        hoofdschotel: "suggestie",
        soep: true,
        dessert: "fruit",
        suggestieVanDeMaand: {
          id: 1,
          maand: 10,
          vegie: false,
          omschrijving: "luikse balletjes",
        },
      },
      {
        id: 4,
        leverdatum: "2023-10-09T00:00:00.000Z",
        typeSandwiches: "wit",
        hartigBeleg: "kaas",
        zoetBeleg: "speculoos",
        vetstof: false,
        soep: true,
        dessert: "zuivel",
      },
    ],
  },
];
module.exports = { MEDERWERKERS, BESTELLINGEN };

//mock data POST /api/bestellingen:

let nieuweBestelling = {
  medewerker: {
    id: 1,
    naam: "Vandekerckhove",
    voornaam: "Brecht",
    dienst: "L24u",
  },
  maaltijden: {
    id: 3,
    leverdatum: "2023-10-17T00:00:00.000Z",
    hoofdschotel: "suggestie",
    soep: true,
    dessert: "zuivel",
    suggestieVanDeMaand: {
      id: 2,
      maand: 10,
      vegie: true,
      omschrijving: "pasta pesto",
    },
  },
};
