const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {

  const suggestieVanDeMaandData = [
    {
      maand: 1,
      vegie: false,
      omschrijving: "zalmfilet met gestoomde groenten",
    },
    { maand: 1, vegie: true, omschrijving: "gevulde paprika met quinoa" },
    { maand: 2, vegie: false, omschrijving: "kip curry met rijst" },
    { maand: 2, vegie: true, omschrijving: "aubergine Parmigiana" },
    { maand: 3, vegie: false, omschrijving: "lamskoteletten met mintsaus" },
    { maand: 3, vegie: true, omschrijving: "vegetarische paëlla" },
    { maand: 4, vegie: false, omschrijving: "lamskoteletten met mintsaus" },
    { maand: 4, vegie: true, omschrijving: "vegatarische paella" },
    {
      maand: 5,
      vegie: false,
      omschrijving: "balletjes in tomatensaus met puree",
    },
    {
      maand: 5,
      vegie: true,
      omschrijving: "vegatarische balletjes in tomatensaus met puree",
    },
    { maand: 6, vegie: false, omschrijving: "caesarsalade" },
    {
      maand: 6,
      vegie: true,
      omschrijving: "quinoasalade met feta en gegrilde groenten",
    },
    { maand: 7, vegie: false, omschrijving: "spiesjes met kip en ananas" },
    { maand: 7, vegie: true, omschrijving: "vegetarische wok" },
    { maand: 8, vegie: false, omschrijving: "pokébowl met zalm" },
    { maand: 8, vegie: true, omschrijving: "pokébowl met tofu" },
    {
      maand: 9,
      vegie: false,
      omschrijving: "pasta met scampi's en tomatensaus",
    },
    { maand: 9, vegie: true, omschrijving: "pasta pomodoro" },
    {
      maand: 10,
      vegie: false,
      omschrijving: "gekruide balletjes met luikse saus, wortelstamppot",
    },
    { maand: 10, vegie: true, omschrijving: "pasta pesto" },
    {
      maand: 11,
      vegie: false,
      omschrijving:
        "kalkoenpavé met roomsaus, rode kool met appeltjes en aardappelpuree",
    },
    {
      maand: 11,
      vegie: true,
      omschrijving: "quornblokjes met zoetzure saus en gebakken rijst",
    },
    { maand: 12, vegie: false, omschrijving: "lasagne" },
    {
      maand: 12,
      vegie: true,
      omschrijving: "rode bietburger met bloemkool en gekookte aardappelen",
    },
  ];

  // Upsert suggestieVanDeMaand records
  const suggestieVanDeMaandRecords = await Promise.all(
    suggestieVanDeMaandData.map((data) =>
      prisma.suggestieVanDeMaand.upsert({
        where: { maand_vegie: { maand: data.maand, vegie: data.vegie } },
        update: {},
        create: data,
      })
    )
  );


  const brecht = await prisma.medewerker.create({
    include: {
      bestellingen: {
        include: {
          maaltijden: true,
        },
      },
    },
    data: {
      naam: "Vandekerckhove",
      voornaam: "Brecht",
      dienst: "L24U",
      bestellingen: {
        create: [
          {
            besteldatum: new Date("2023-11-05"),
            maaltijden: {
              create: [
                {
                  type: "warmeMaaltijd",
                  leverdatum: new Date("2023-11-10"),
                  hoofdschotel: "lasagne",
                  soep: true,
                  dessert: "zuivel",
                },
                {
                  type: "warmeMaaltijd",
                  leverdatum: new Date("2023-11-11"),
                  hoofdschotel: "suggestie",
                  soep: false,
                  dessert: "fruit",
                  suggestieVanDeMaand: {
                    connect: {
                      maand_vegie: {
                        maand: 11,
                        vegie: false,
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            besteldatum: new Date("2023-11-05"),
            maaltijden: {
              create: {
                type: "broodMaaltijd",
                leverdatum: new Date("2023-11-12"),
                typeSandwiches: "wit",
                soep: true,
                dessert: "zuivel",
                hartigBeleg: "salami",
                zoetBeleg: "confituur",
                vetstof: true,
              },
            },
          },
        ],
      },
    },
  });

  const melissa = await prisma.medewerker.create({
    include: {
      bestellingen: {
        include: {
          maaltijden: true,
        },
      },
    },
    data: {
      naam: "Balcaen",
      voornaam: "Melissa",
      dienst: "L24U",
      bestellingen: {
        create: [
          {
            besteldatum: new Date("2023-11-10"),
            maaltijden: {
              create: [
                {
                  type: "warmeMaaltijd",
                  leverdatum: new Date("2023-11-10"),
                  hoofdschotel: "vol-au-vent",
                  soep: false,
                  dessert: "zuivel",
                },
                {
                  type: "warmeMaaltijd",
                  leverdatum: new Date("2023-12-21"),
                  hoofdschotel: "vegetarische suggestie",
                  soep: true,
                  dessert: "fruit",
                  suggestieVanDeMaand: {
                    connect: {
                      maand_vegie: {
                        maand: 12,
                        vegie: true,
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            besteldatum: new Date("2023-11-20"),
            maaltijden: {
              create: [
                {
                  type: "broodmaaltijd",
                  leverdatum: new Date("2023-12-20"),
                  typeSandwiches: "bruin",
                  soep: true,
                  dessert: "fruit",
                  hartigBeleg: "jonge kaas",
                  zoetBeleg: "choco",
                  vetstof: false,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
