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
    bestellingsnr: 33,
    besteldatum: "2023-10-01T00:00:00.000Z",
    medewerker: {
      id: 4,
      naam: "Vandekerckhove",
      voornaam: "Brecht",
      dienst: "L24u",
    },
    maaltijden: [
      {
        id: 5,
        type: "warmeMaaltijd",
        leverdatum: "2023-11-07T00:00:00.000Z",
        hoofdschotel: "lasagne",
        soep: true,
        dessert: "zuivel",
        typeSandwiches: null,
        hartigBeleg: null,
        zoetBeleg: null,
        vetstof: null,
        suggestieVanDeMaand: null,
      },
      {
        id: 6,
        type: "broodMaaltijd",
        leverdatum: "2023-11-08T00:00:00.000Z",
        hoofdschotel: null,
        typeSandwiches: "bruin",
        hartigBeleg: "hesp",
        zoetBeleg: "choco",
        vetstof: true,
        soep: false,
        dessert: "fruit",
        suggestieVanDeMaand: null,
      },
    ],
  },
  {
    bestellingsnr: 77,
    besteldatum: "2023-12-03T00:00:00.000Z",
    medewerker: {
      id: 2,
      naam: "Balcaen",
      voornaam: "Melissa",
      dienst: "L24u",
    },
    maaltijden: [
      {
        id: 8,
        type: "warmeMaaltijd",
        leverdatum: "2023-12-07T00:00:00.000Z",
        hoofdschotel: "suggestie",
        soep: true,
        dessert: "fruit",
        typeSandwiches: null,
        hartigBeleg: null,
        zoetBeleg: null,
        vetstof: null,
        suggestieVanDeMaand: {
          id: 9,
          maand: 10,
          vegie: false,
          omschrijving: "luikse balletjes",
        },
      },
      {
        id: 10,
        type: "broodMaaltijd",
        leverdatum: "2023-11-09T00:00:00.000Z",
        hoofdschotel: null,
        typeSandwiches: "wit",
        hartigBeleg: "kaas",
        zoetBeleg: "speculoos",
        vetstof: false,
        soep: true,
        dessert: "zuivel",
        suggestieVanDeMaand: null,
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
    type: "warmeMaaltijd",
    leverdatum: "2023-10-17T00:00:00.000Z",
    hoofdschotel: "suggestie",
    soep: true,
    dessert: "zuivel",
    typeSandwiches: null,
    hartigBeleg: null,
    zoetBeleg: null,
    vetstof: null,
    suggestieVanDeMaand: {
      id: 2,
      maand: 10,
      vegie: true,
      omschrijving: "pasta pesto",
    },
  },
};
