import { category } from "@/data/data";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
async function main() {
  await prisma.category.createMany({
    data: category,
  });
}
main()
  .then(() => {
    console.log("Create Category Data");
  })
  .catch((err) => {
    console.log(err.message);
  });
