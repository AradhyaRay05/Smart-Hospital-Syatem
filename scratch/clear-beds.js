const { PrismaClient } = require("../app/generated/prisma/client");
const prisma = new PrismaClient();

async function main() {
  const logs = await prisma.bedStatusLog.deleteMany({});
  const beds = await prisma.bed.deleteMany({});
  const wards = await prisma.ward.deleteMany({});
  console.log(`Successfully cleared dummy data: ${logs.count} logs, ${beds.count} beds, ${wards.count} wards.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
