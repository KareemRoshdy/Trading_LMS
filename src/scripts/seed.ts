const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Stock Trading" },
        { name: "Basics of Stock Trading" },
        { name: "Technical Analysis" },
        { name: "Fundamental Analysis" },
        { name: "Forex Trading" },
        { name: "Introduction to Forex" },
        { name: "Currency Pairs" },
        { name: "Forex Strategies" },
        { name: "Risk Management in Forex" },
        { name: "Options Trading" },
        { name: "Basics of Options" },
        { name: "Options Strategies" },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
