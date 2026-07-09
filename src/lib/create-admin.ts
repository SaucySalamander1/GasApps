import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] ?? 'Admin';

  if (!email || !password) {
    console.error('Usage: npx ts-node src/lib/create-admin.ts <email> <password> [name]');
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.error(`An admin with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.create({
    data: { email, passwordHash, name },
  });

  console.log(`Admin account created: ${admin.email} (${admin.name})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });