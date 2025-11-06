import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

async function main() {
  const admins = [
    { name: "Ankit", email: "ankit@careerboat.ai", password: "Ankit@123" },
    { name: "Rehan", email: "rehan@careerboat.ai", password: "Rehan@123" },
    { name: "Anshul", email: "anshul@careerboat.ai", password: "Anshul@123" },
    { name: "Pratik", email: "pratik@careerboat.ai", password: "Pratik@123" },
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const user = await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
      },
    });

    console.log(`Admin seeded: ${user.name} (${user.email})`);
  }
}

main()
  .then(() => {
    console.log("All admins seeded successfully.");
  })
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
